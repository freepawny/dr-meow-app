<?php
declare(strict_types=1);

$db = json_decode((string) file_get_contents($dbPath), true) ?: ['services' => []];
$services = $db['services'] ?? [];

$resourceId = null;
if (preg_match('#^/api/v1/services/([a-zA-Z0-9_-]+)$#', $path, $m)) {
    $resourceId = (string) $m[1];
}

if ($method === 'GET' && $resourceId === null) {
    $rawActive = $_GET['active'] ?? '';
    $activeOnly = ($rawActive === 'true' || $rawActive === '1');
    $result = $activeOnly
        ? array_values(array_filter($services, static fn(array $s): bool => (bool) ($s['is_active'] ?? true)))
        : array_values($services);

    echo json_encode([
        'success' => true,
        'message' => 'Services retrieved successfully',
        'data' => $result,
        'errors' => []
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'GET' && $resourceId !== null) {
    foreach ($services as $item) {
        if ((string) ($item['id'] ?? '') === $resourceId) {
            echo json_encode([
                'success' => true,
                'message' => 'Service retrieved successfully',
                'data' => $item,
                'errors' => []
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Service not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'POST' && $resourceId === null) {
    $name = trim((string) ($requestBody['name'] ?? ''));
    $badge = trim((string) ($requestBody['badge_label'] ?? ($requestBody['badgeLabel'] ?? '')));
    $description = trim((string) ($requestBody['description'] ?? ''));
    $basePrice = $requestBody['base_price'] ?? ($requestBody['basePrice'] ?? null);

    if ($name === '' || $badge === '' || $description === '' || !is_int($basePrice) || $basePrice < 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => "Fields 'name', 'badge_label', 'description', and non-negative integer 'base_price' are required.",
            'data' => null,
            'errors' => []
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    $slug = strtolower(trim((string) preg_replace('/[^A-Za-z0-9-]+/', '-', $name), '-'));
    $newService = [
        'id' => !empty($requestBody['id']) ? (string) $requestBody['id'] : ($slug ?: 'service-' . uniqid()),
        'name' => $name,
        'badge_label' => $badge,
        'description' => $description,
        'is_popular' => (bool) ($requestBody['is_popular'] ?? ($requestBody['isPopular'] ?? false)),
        'base_price' => $basePrice,
        'tier_prices' => is_array($requestBody['tier_prices'] ?? null) ? $requestBody['tier_prices'] : [],
        'features' => is_array($requestBody['features'] ?? null) ? array_values($requestBody['features']) : [],
        'is_active' => (bool) ($requestBody['is_active'] ?? ($requestBody['isActive'] ?? true)),
    ];

    $db['services'][] = $newService;
    file_put_contents($dbPath, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL, LOCK_EX);

    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'Service created successfully', 'data' => $newService, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'PUT' && $resourceId !== null) {
    foreach ($services as $index => $item) {
        if ((string) ($item['id'] ?? '') === $resourceId) {
            $updated = array_merge($item, $requestBody, ['id' => $resourceId]);
            $db['services'][$index] = $updated;
            file_put_contents($dbPath, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL, LOCK_EX);

            echo json_encode(['success' => true, 'message' => 'Service updated successfully', 'data' => $updated, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Service not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'DELETE' && $resourceId !== null) {
    foreach ($services as $index => $item) {
        if ((string) ($item['id'] ?? '') === $resourceId) {
            array_splice($db['services'], $index, 1);
            file_put_contents($dbPath, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL, LOCK_EX);

            echo json_encode(['success' => true, 'message' => 'Service deleted successfully', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Service not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

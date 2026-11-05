<?php
declare(strict_types=1);

$db = json_decode((string) file_get_contents($dbPath), true) ?: ['cats' => [], 'customers' => []];
$cats = $db['cats'] ?? [];
$customers = $db['customers'] ?? [];

if (isset($customerCatsFilterId)) {
    $customerFound = false;
    foreach ($customers as $c) {
        if ((string) ($c['customer_id'] ?? '') === $customerCatsFilterId) {
            $customerFound = true;
            break;
        }
    }
    if (!$customerFound) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Customer not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    $filtered = array_values(array_filter(
        $cats,
        static fn(array $cat): bool => (string) ($cat['customer_id'] ?? '') === $customerCatsFilterId
    ));

    echo json_encode([
        'success' => true,
        'message' => 'Customer cats retrieved successfully',
        'data' => $filtered,
        'errors' => []
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$resourceId = null;
if (preg_match('#^/api/v1/cats/([a-zA-Z0-9_-]+)$#', $path, $m)) {
    $resourceId = (string) $m[1];
}

if ($method === 'GET' && $resourceId === null) {
    echo json_encode([
        'success' => true,
        'message' => 'Cats retrieved successfully',
        'data' => array_values($cats),
        'errors' => []
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'GET' && $resourceId !== null) {
    foreach ($cats as $item) {
        if ((string) ($item['cat_id'] ?? '') === $resourceId) {
            echo json_encode([
                'success' => true,
                'message' => 'Cat retrieved successfully',
                'data' => $item,
                'errors' => []
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Cat not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'POST' && $resourceId === null) {
    $customerId = trim((string) ($requestBody['customer_id'] ?? ''));
    $name = trim((string) ($requestBody['name'] ?? ''));
    $breeds = trim((string) ($requestBody['breeds'] ?? ''));
    $weight = $requestBody['weight'] ?? 0;

    if ($customerId === '' || $name === '' || $breeds === '' || !is_numeric($weight) || (float) $weight <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => "Fields 'customer_id', 'name', 'breeds', and positive 'weight' are required.",
            'data' => null,
            'errors' => []
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    $customerExists = false;
    foreach ($customers as $c) {
        if ((string) ($c['customer_id'] ?? '') === $customerId) {
            $customerExists = true;
            break;
        }
    }
    if (!$customerExists) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Customer not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    $newCat = [
        'cat_id' => !empty($requestBody['cat_id'])
            ? (string) $requestBody['cat_id']
            : 'CAT-' . strtoupper(bin2hex(random_bytes(4))),
        'customer_id' => $customerId,
        'name' => $name,
        'weight' => (float) $weight,
        'breeds' => $breeds,
        'vital_temperature' => isset($requestBody['vital_temperature']) && $requestBody['vital_temperature'] !== null
            ? (float) $requestBody['vital_temperature']
            : null,
        'tempramen' => trim((string) ($requestBody['tempramen'] ?? 'Friendly')),
        'medical_history' => trim((string) ($requestBody['medical_history'] ?? '')),
        'last_picture' => isset($requestBody['last_picture']) && $requestBody['last_picture'] !== null
            ? trim((string) $requestBody['last_picture'])
            : null,
    ];

    $db['cats'][] = $newCat;
    file_put_contents($dbPath, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL, LOCK_EX);

    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'Cat created successfully', 'data' => $newCat, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'PUT' && $resourceId !== null) {
    foreach ($cats as $index => $item) {
        if ((string) ($item['cat_id'] ?? '') === $resourceId) {
            $updated = array_merge($item, $requestBody, ['cat_id' => $resourceId]);
            $db['cats'][$index] = $updated;
            file_put_contents($dbPath, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL, LOCK_EX);

            echo json_encode(['success' => true, 'message' => 'Cat updated successfully', 'data' => $updated, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Cat not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'DELETE' && $resourceId !== null) {
    foreach ($cats as $index => $item) {
        if ((string) ($item['cat_id'] ?? '') === $resourceId) {
            array_splice($db['cats'], $index, 1);
            file_put_contents($dbPath, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL, LOCK_EX);

            echo json_encode(['success' => true, 'message' => 'Cat deleted successfully', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Cat not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

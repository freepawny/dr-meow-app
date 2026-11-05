<?php
declare(strict_types=1);

$db = json_decode((string) file_get_contents($dbPath), true) ?: ['customers' => []];
$customers = $db['customers'] ?? [];

$resourceId = null;
if (preg_match('#^/api/v1/customers/([a-zA-Z0-9_-]+)$#', $path, $m)) {
    $resourceId = (string) $m[1];
}

if ($method === 'GET' && $resourceId === null) {
    echo json_encode([
        'success' => true,
        'message' => 'Customers retrieved successfully',
        'data' => array_values($customers),
        'errors' => []
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'GET' && $resourceId !== null) {
    foreach ($customers as $item) {
        if ((string) ($item['customer_id'] ?? '') === $resourceId) {
            echo json_encode([
                'success' => true,
                'message' => 'Customer retrieved successfully',
                'data' => $item,
                'errors' => []
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Customer not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'POST' && $resourceId === null) {
    $name = trim((string) ($requestBody['name'] ?? ''));
    $phone = trim((string) ($requestBody['phone_number'] ?? ''));
    $schedule = trim((string) ($requestBody['schedule'] ?? ''));
    $address = trim((string) ($requestBody['address'] ?? ''));

    if ($name === '' || $phone === '' || $schedule === '' || $address === '') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => "Fields 'name', 'phone_number', 'schedule', and 'address' are required.",
            'data' => null,
            'errors' => []
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    if (!preg_match('/^\+?[0-9]{10,15}$/', $phone)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Customer phone number format is invalid.',
            'data' => null,
            'errors' => []
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    $newCustomer = [
        'customer_id' => !empty($requestBody['customer_id'])
            ? (string) $requestBody['customer_id']
            : 'CUS-' . strtoupper(bin2hex(random_bytes(4))),
        'name' => $name,
        'phone_number' => $phone,
        'schedule' => $schedule,
        'address' => $address,
        'preference_notification' => (bool) ($requestBody['preference_notification'] ?? true),
    ];

    $db['customers'][] = $newCustomer;
    file_put_contents($dbPath, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL, LOCK_EX);

    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'Customer created successfully', 'data' => $newCustomer, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'PUT' && $resourceId !== null) {
    foreach ($customers as $index => $item) {
        if ((string) ($item['customer_id'] ?? '') === $resourceId) {
            $updated = array_merge($item, $requestBody, ['customer_id' => $resourceId]);
            $db['customers'][$index] = $updated;
            file_put_contents($dbPath, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL, LOCK_EX);

            echo json_encode(['success' => true, 'message' => 'Customer updated successfully', 'data' => $updated, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Customer not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'DELETE' && $resourceId !== null) {
    foreach ($customers as $index => $item) {
        if ((string) ($item['customer_id'] ?? '') === $resourceId) {
            array_splice($db['customers'], $index, 1);
            file_put_contents($dbPath, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL, LOCK_EX);

            echo json_encode(['success' => true, 'message' => 'Customer deleted successfully', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Customer not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

<?php
declare(strict_types=1);

$db = json_decode((string) file_get_contents($dbPath), true) ?: [
    'reservations' => [],
    'customers' => [],
    'cats' => [],
    'services' => []
];
$reservations = $db['reservations'] ?? [];
$customers = $db['customers'] ?? [];
$cats = $db['cats'] ?? [];
$services = $db['services'] ?? [];

if (isset($customerReservationsFilterId)) {
    $customerFound = false;
    foreach ($customers as $c) {
        if ((string) ($c['customer_id'] ?? '') === $customerReservationsFilterId) {
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
        $reservations,
        static fn(array $r): bool => (string) ($r['customer_id'] ?? '') === $customerReservationsFilterId
    ));

    echo json_encode([
        'success' => true,
        'message' => 'Customer reservations retrieved successfully',
        'data' => $filtered,
        'errors' => []
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$resourceId = null;
if (preg_match('#^/api/v1/reservations/([a-zA-Z0-9_-]+)$#', $path, $m)) {
    $resourceId = (string) $m[1];
}

if ($method === 'GET' && $resourceId === null) {
    echo json_encode([
        'success' => true,
        'message' => 'Reservations retrieved successfully',
        'data' => array_values($reservations),
        'errors' => []
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'GET' && $resourceId !== null) {
    foreach ($reservations as $item) {
        if ((string) ($item['reservation_id'] ?? '') === $resourceId) {
            echo json_encode([
                'success' => true,
                'message' => 'Reservation retrieved successfully',
                'data' => $item,
                'errors' => []
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Reservation not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'POST' && $resourceId === null) {
    $serviceId = trim((string) ($requestBody['service_id'] ?? ''));
    $customerId = trim((string) ($requestBody['customer_id'] ?? ''));
    $catId = trim((string) ($requestBody['cat_id'] ?? ''));
    $serviceMethod = trim((string) ($requestBody['service_method'] ?? ''));

    if ($serviceId === '' || $customerId === '' || $catId === '' || $serviceMethod === '') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => "Fields 'service_id', 'customer_id', 'cat_id', and 'service_method' are required.",
            'data' => null,
            'errors' => []
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    $foundCustomer = null;
    foreach ($customers as $c) {
        if ((string) ($c['customer_id'] ?? '') === $customerId) {
            $foundCustomer = $c;
            break;
        }
    }
    if ($foundCustomer === null) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Customer not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    $foundCat = null;
    foreach ($cats as $cat) {
        if ((string) ($cat['cat_id'] ?? '') === $catId) {
            $foundCat = $cat;
            break;
        }
    }
    if ($foundCat === null) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Cat not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    if ((string) ($foundCat['customer_id'] ?? '') !== $customerId) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => 'The selected cat does not belong to this customer', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    $foundService = null;
    foreach ($services as $srv) {
        if ((string) ($srv['id'] ?? '') === $serviceId) {
            $foundService = $srv;
            break;
        }
    }
    if ($foundService === null) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Service not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    if (!(bool) ($foundService['is_active'] ?? true)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => 'Service is currently inactive', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    $newReservation = [
        'reservation_id' => !empty($requestBody['reservation_id'])
            ? (string) $requestBody['reservation_id']
            : 'RES-' . strtoupper(bin2hex(random_bytes(4))),
        'service_id' => $serviceId,
        'customer_id' => $customerId,
        'cat_id' => $catId,
        'service_method' => $serviceMethod,
        'work_status' => trim((string) ($requestBody['work_status'] ?? 'Pending')),
        'notification_h1' => (bool) ($requestBody['notification_h1'] ?? false),
        'total_bill' => (int) ($requestBody['total_bill'] ?? 0),
        'paymen_status' => trim((string) ($requestBody['paymen_status'] ?? 'Unpaid')),
        'before_after' => is_array($requestBody['before_after'] ?? null)
            ? $requestBody['before_after']
            : ['before' => null, 'after' => null],
    ];

    $db['reservations'][] = $newReservation;
    file_put_contents($dbPath, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL, LOCK_EX);

    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'Reservation created successfully', 'data' => $newReservation, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'PUT' && $resourceId !== null) {
    foreach ($reservations as $index => $item) {
        if ((string) ($item['reservation_id'] ?? '') === $resourceId) {
            $updated = array_merge($item, $requestBody, ['reservation_id' => $resourceId]);
            $db['reservations'][$index] = $updated;
            file_put_contents($dbPath, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL, LOCK_EX);

            echo json_encode(['success' => true, 'message' => 'Reservation updated successfully', 'data' => $updated, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Reservation not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'DELETE' && $resourceId !== null) {
    foreach ($reservations as $index => $item) {
        if ((string) ($item['reservation_id'] ?? '') === $resourceId) {
            array_splice($db['reservations'], $index, 1);
            file_put_contents($dbPath, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL, LOCK_EX);

            echo json_encode(['success' => true, 'message' => 'Reservation deleted successfully', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Reservation not found', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed', 'data' => null, 'errors' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

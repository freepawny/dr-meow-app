<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$services = [
    [
        'id' => 1,
        'name' => 'Basic Grooming',
        'description' => 'Mandi, pengeringan, penyisiran, dan potong kuku.',
        'price' => 50000,
        'duration_minutes' => 60,
        'category' => 'basic'
    ],
    [
        'id' => 2,
        'name' => 'Full Grooming',
        'description' => 'Perawatan lengkap untuk kucing.',
        'price' => 85000,
        'duration_minutes' => 90,
        'category' => 'full'
    ],
    [
        'id' => 3,
        'name' => 'Kitten Grooming',
        'description' => 'Perawatan khusus anak kucing.',
        'price' => 45000,
        'duration_minutes' => 45,
        'category' => 'kitten'
    ]
];

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method !== 'GET') {
    http_response_code(405);
    header('Allow: GET');
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed',
        'errors' => []
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (isset($_GET['id']) && ($id === false || $id === null || $id < 1)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid service id',
        'errors' => ['id' => 'ID harus berupa bilangan bulat positif.']
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($id !== null && $id !== false) {
    foreach ($services as $service) {
        if ($service['id'] === $id) {
            echo json_encode([
                'success' => true,
                'message' => 'Service found',
                'data' => $service
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }

    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Service not found',
        'errors' => []
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Services retrieved successfully',
    'data' => $services
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

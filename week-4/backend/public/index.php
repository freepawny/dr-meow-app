<?php
declare(strict_types=1);

// ====================================================
// WEEK 4 — SIMPLE REST API CONTRACT DISPATCHER
// (Flat JSON Endpoint Scripts — Belum OOP / MVC)
// ====================================================

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Vary: Origin');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$path = rtrim((string) $path, '/') ?: '/';
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$dbPath = __DIR__ . '/../storage/db.json';

$rawBody = file_get_contents('php://input');
$requestBody = [];
if ($rawBody !== false && trim($rawBody) !== '') {
    $decoded = json_decode($rawBody, true);
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
        if ($method === 'POST' || $method === 'PUT') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid JSON payload in request body',
                'data' => null,
                'errors' => []
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    } else {
        $requestBody = $decoded;
    }
}

if ($path === '/api/v1/health') {
    require __DIR__ . '/../api/health.php';
    exit;
}

if ($path === '/api/v1/services' || str_starts_with($path, '/api/v1/services/')) {
    require __DIR__ . '/../api/services.php';
    exit;
}

if (preg_match('#^/api/v1/customers/([a-zA-Z0-9_-]+)/cats$#', $path, $routeMatches)) {
    $customerCatsFilterId = (string) $routeMatches[1];
    require __DIR__ . '/../api/cats.php';
    exit;
}

if (preg_match('#^/api/v1/customers/([a-zA-Z0-9_-]+)/reservations$#', $path, $routeMatches)) {
    $customerReservationsFilterId = (string) $routeMatches[1];
    require __DIR__ . '/../api/reservations.php';
    exit;
}

if ($path === '/api/v1/customers' || str_starts_with($path, '/api/v1/customers/')) {
    require __DIR__ . '/../api/customers.php';
    exit;
}

if ($path === '/api/v1/cats' || str_starts_with($path, '/api/v1/cats/')) {
    require __DIR__ . '/../api/cats.php';
    exit;
}

if ($path === '/api/v1/reservations' || str_starts_with($path, '/api/v1/reservations/')) {
    require __DIR__ . '/../api/reservations.php';
    exit;
}

http_response_code(404);
echo json_encode([
    'success' => false,
    'message' => 'Route not found',
    'data' => null,
    'errors' => []
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

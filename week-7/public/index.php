<?php

declare(strict_types=1);

use App\Core\JsonView;
use App\Core\Request;
use App\Core\Router;

require_once dirname(__DIR__) . '/bootstrap.php';

// CORS: sesuaikan daftar origin saat frontend dipindahkan ke domain lain.
$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Accept, Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    /** @var Router $router */
    $router = require dirname(__DIR__) . '/app/Routes/api.php';
    $router->dispatch(Request::capture());
} catch (InvalidArgumentException $exception) {
    JsonView::error($exception->getMessage(), 400);
} catch (Throwable $exception) {
    // Detail exception dicatat di log server, tidak dibocorkan ke client.
    error_log((string) $exception);
    JsonView::error('Internal server error', 500);
}

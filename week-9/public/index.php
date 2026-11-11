<?php
declare(strict_types=1);

use App\Core\HttpException;
use App\Core\JsonView;
use App\Core\Request;
use App\Core\Router;

require_once dirname(__DIR__) . '/bootstrap.php';

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

if (strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$request = Request::capture();

// Serve compiled React/Vite Views from dist/ when non-API routes are accessed directly
if (!str_starts_with($request->path, '/api/')) {
    $distDir = dirname(__DIR__) . '/dist';
    $candidateAsset = realpath($distDir . $request->path);
    $realDistDir = realpath($distDir);

    if (
        $realDistDir !== false
        && $candidateAsset !== false
        && str_starts_with($candidateAsset, $realDistDir)
        && is_file($candidateAsset)
    ) {
        $ext = strtolower(pathinfo($candidateAsset, PATHINFO_EXTENSION));
        $mime = match ($ext) {
            'js' => 'application/javascript; charset=utf-8',
            'css' => 'text/css; charset=utf-8',
            'svg' => 'image/svg+xml',
            'json' => 'application/json; charset=utf-8',
            'html' => 'text/html; charset=utf-8',
            default => mime_content_type($candidateAsset) ?: 'application/octet-stream',
        };
        header("Content-Type: {$mime}");
        readfile($candidateAsset);
        exit;
    }

    if (is_file($distDir . '/index.html')) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($distDir . '/index.html');
        exit;
    }
}

try {
    /** @var Router $router */
    $router = require dirname(__DIR__) . '/app/Routes/api.php';
    $router->dispatch($request);
} catch (HttpException $exception) {
    JsonView::error(
        $exception->getMessage(),
        $exception->getStatusCode(),
        $exception->getErrors()
    );
} catch (InvalidArgumentException $exception) {
    JsonView::error($exception->getMessage(), 400);
} catch (Throwable $exception) {
    error_log((string) $exception);
    JsonView::error('Internal server error: ' . $exception->getMessage(), 500);
}

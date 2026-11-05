<?php
declare(strict_types=1);

/**
 * Procedural HTTP request & response helpers (Week 5 — Server-Side Procedural PHP).
 */

function applyCorsHeaders(): void
{
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
}

function sendJsonResponse(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(
        $payload,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT
    );
    exit;
}

function sendJsonSuccess(
    mixed $data = null,
    string $message = 'Request successful',
    int $status = 200
): never {
    sendJsonResponse($status, [
        'success' => true,
        'message' => $message,
        'data' => $data,
        'errors' => [],
    ]);
}

function sendJsonError(
    string $message,
    int $status = 400,
    array $errors = []
): never {
    sendJsonResponse($status, [
        'success' => false,
        'message' => $message,
        'data' => null,
        'errors' => $errors,
    ]);
}

function readJsonRequestBody(string $method): array
{
    $rawBody = file_get_contents('php://input');
    if ($rawBody === false || trim($rawBody) === '') {
        return [];
    }

    $decoded = json_decode($rawBody, true);
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
        if ($method === 'POST' || $method === 'PUT') {
            sendJsonError('Invalid JSON payload in request body', 400);
        }
        return [];
    }

    return $decoded;
}

function normalizeBooleanFlag(mixed $value): bool
{
    if (is_bool($value)) {
        return $value;
    }
    if (is_int($value)) {
        if ($value === 1) {
            return true;
        }
        if ($value === 0) {
            return false;
        }
    }
    if (is_string($value)) {
        $normalized = strtolower(trim($value));
        if ($normalized === 'true' || $normalized === '1') {
            return true;
        }
        if ($normalized === 'false' || $normalized === '0') {
            return false;
        }
    }
    throw new InvalidArgumentException('Invalid boolean value.');
}

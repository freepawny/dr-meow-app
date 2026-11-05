<?php
declare(strict_types=1);

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed',
        'data' => null,
        'errors' => []
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'API health check passed',
    'data' => ['status' => 'ok'],
    'errors' => []
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

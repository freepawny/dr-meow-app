<?php
declare(strict_types=1);

require_once __DIR__ . '/../src/Entities/Service.php';
require_once __DIR__ . '/../src/Repositories/InMemoryServiceRepository.php';

use App\Repositories\InMemoryServiceRepository;

header('Content-Type: application/json; charset=utf-8');

$repository = new InMemoryServiceRepository();
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function jsonResponse(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($method !== 'GET' || !in_array($path, ['/api/services', '/api/services/'], true)) {
    jsonResponse(404, ['success' => false, 'message' => 'Route not found', 'errors' => []]);
}

if (isset($_GET['id'])) {
    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
    if ($id === false || $id < 1) {
        jsonResponse(400, ['success' => false, 'message' => 'Invalid service id', 'errors' => []]);
    }

    $service = $repository->findActiveById($id);
    if ($service === null) {
        jsonResponse(404, ['success' => false, 'message' => 'Service not found', 'errors' => []]);
    }

    jsonResponse(200, [
        'success' => true,
        'message' => 'Service retrieved successfully',
        'data' => $service->toArray()
    ]);
}

$data = array_map(
    static fn ($service): array => $service->toArray(),
    $repository->findActive()
);

jsonResponse(200, [
    'success' => true,
    'message' => 'Services retrieved successfully',
    'data' => $data
]);

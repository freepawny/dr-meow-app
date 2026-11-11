<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\JsonView;
use App\Core\Request;
use App\Services\ServiceService;

final class ServiceController
{
    public function __construct(private ServiceService $serviceService) {}

    public function index(Request $request): never
    {
        $rawActive = $request->query['active'] ?? '';
        $activeOnly = ($rawActive === 'true' || $rawActive === '1');
        JsonView::success(
            $this->serviceService->listServices($activeOnly),
            'Services retrieved successfully'
        );
    }

    public function show(Request $request, array $params): never
    {
        $id = $this->requireId($params, 'id');
        JsonView::success(
            $this->serviceService->getService($id),
            'Service retrieved successfully'
        );
    }

    public function store(Request $request): never
    {
        JsonView::success(
            $this->serviceService->createService($request->body),
            'Service created successfully',
            201
        );
    }

    public function update(Request $request, array $params): never
    {
        $id = $this->requireId($params, 'id');
        JsonView::success(
            $this->serviceService->updateService($id, $request->body),
            'Service updated successfully'
        );
    }

    public function destroy(Request $request, array $params): never
    {
        $id = $this->requireId($params, 'id');
        $this->serviceService->deleteService($id);
        JsonView::success(null, 'Service deleted successfully');
    }

    private function requireId(array $params, string $key): string
    {
        $id = trim((string) ($params[$key] ?? ''));
        if ($id === '') {
            JsonView::error('Resource ID is required', 400);
        }
        return $id;
    }
}

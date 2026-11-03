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
        $activeOnly = ($request->query['active'] ?? '') === 'true';
        JsonView::success($this->serviceService->listServices($activeOnly), 'Services retrieved successfully');
    }

    public function show(Request $request, array $params): never
    {
        $service = $this->serviceService->getService($this->id($params));
        if ($service === null) { JsonView::error('Service not found', 404); }
        JsonView::success($service, 'Service retrieved successfully');
    }

    public function store(Request $request): never
    {
        JsonView::success($this->serviceService->createService($request->body), 'Service created successfully', 201);
    }

    public function update(Request $request, array $params): never
    {
        $service = $this->serviceService->updateService($this->id($params), $request->body);
        if ($service === null) { JsonView::error('Service not found', 404); }
        JsonView::success($service, 'Service updated successfully');
    }

    public function destroy(Request $request, array $params): never
    {
        if (!$this->serviceService->deleteService($this->id($params))) { JsonView::error('Service not found', 404); }
        JsonView::success(null, 'Service deleted successfully');
    }

    private function id(array $params): int
    {
        $raw = $params['id'] ?? '';
        if (!ctype_digit($raw) || (int) $raw < 1) { JsonView::error('Service ID must be a positive integer', 400); }
        return (int) $raw;
    }
}

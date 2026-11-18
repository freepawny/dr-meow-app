<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Service::query();
        if ($request->boolean('active')) {
            $query->where('is_active', true);
        }
        return $this->success($query->get(), 'Services retrieved successfully');
    }

    public function show(string $id): JsonResponse
    {
        $service = Service::find($id);
        if (!$service) {
            return $this->error('Service not found', 404);
        }
        return $this->success($service, 'Service retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = Str::slug($data['name'] ?? ('service-' . Str::random(6)));
        }
        $service = Service::create($data);
        return $this->success($service, 'Service created successfully', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $service = Service::find($id);
        if (!$service) {
            return $this->error('Service not found', 404);
        }
        $service->update($request->all());
        return $this->success($service, 'Service updated successfully');
    }

    public function destroy(string $id): JsonResponse
    {
        $service = Service::find($id);
        if (!$service) {
            return $this->error('Service not found', 404);
        }
        $service->delete();
        return $this->success(null, 'Service deleted successfully');
    }
}

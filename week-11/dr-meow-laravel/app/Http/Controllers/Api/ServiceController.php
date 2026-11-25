<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceRequest;
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
        if (! $service) {
            return $this->error('Service not found', 404);
        }

        return $this->success($service, 'Service retrieved successfully');
    }

    public function store(ServiceRequest $request): JsonResponse
    {
        $data = $this->mapData($request->validated(), true);
        if (empty($data['id'])) {
            $slug = Str::slug($data['name']);
            $data['id'] = $slug !== '' ? $slug : ('service-'.Str::random(6));
        }
        $service = Service::create($data);

        return $this->success($service, 'Service created successfully', 201);
    }

    public function update(ServiceRequest $request, string $id): JsonResponse
    {
        $service = Service::find($id);
        if (! $service) {
            return $this->error('Service not found', 404);
        }

        $service->update($this->mapData($request->validated(), false));

        return $this->success($service, 'Service updated successfully');
    }

    public function destroy(string $id): JsonResponse
    {
        $service = Service::find($id);
        if (! $service) {
            return $this->error('Service not found', 404);
        }
        $service->delete();

        return $this->success(null, 'Service deleted successfully');
    }

    private function mapData(array $validated, bool $isCreate): array
    {
        $data = [
            'name' => $validated['name'],
            'category' => $validated['category'],
            'base_price' => (int) $validated['price'],
        ];

        if ($isCreate || array_key_exists('duration_minutes', $validated)) {
            $data['duration_minutes'] = $validated['duration_minutes'] ?? null;
        }

        if ($isCreate || array_key_exists('is_active', $validated)) {
            $data['is_active'] = $validated['is_active'] ?? true;
        }

        foreach (['id', 'badge_label', 'description', 'is_popular', 'tier_prices', 'features'] as $field) {
            if (array_key_exists($field, $validated)) {
                $data[$field] = $validated[$field];
            }
        }

        return $data;
    }
}

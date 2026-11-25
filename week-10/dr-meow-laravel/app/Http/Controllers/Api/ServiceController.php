<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
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

    public function store(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), $this->rules());

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors()->toArray());
        }

        $data = $this->mapData($validator->validated(), true);
        if (empty($data['id'])) {
            $slug = Str::slug($data['name']);
            $data['id'] = $slug !== '' ? $slug : ('service-'.Str::random(6));
        }
        $service = Service::create($data);

        return $this->success($service, 'Service created successfully', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $service = Service::find($id);
        if (! $service) {
            return $this->error('Service not found', 404);
        }
        $validator = Validator::make($request->all(), $this->rules());

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors()->toArray());
        }

        $service->update($this->mapData($validator->validated(), false));

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

    private function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'category' => 'required|in:grooming,hotel,clinic,styling',
            'price' => 'required|numeric|min:0',
            'duration_minutes' => 'nullable|integer|min:15',
            'is_active' => 'boolean',
            'id' => 'nullable|string|max:100',
            'badge_label' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'is_popular' => 'boolean',
            'tier_prices' => 'nullable|array',
            'features' => 'nullable|array',
        ];
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

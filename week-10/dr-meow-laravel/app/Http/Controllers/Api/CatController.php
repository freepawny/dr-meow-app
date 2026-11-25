<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CatController extends Controller
{
    public function index(): JsonResponse
    {
        return $this->success(Cat::all(), 'Cats retrieved successfully');
    }

    public function show(string $id): JsonResponse
    {
        $cat = Cat::find($id);
        if (! $cat) {
            return $this->error('Cat not found', 404);
        }

        return $this->success($cat, 'Cat retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), $this->rules());

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors()->toArray());
        }

        $data = $this->mapData($validator->validated(), true);

        if (empty($data['cat_id'])) {
            $data['cat_id'] = 'CAT-'.strtoupper(Str::random(8));
        }

        $cat = Cat::create($data);

        return $this->success($cat, 'Cat created successfully', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $cat = Cat::find($id);
        if (! $cat) {
            return $this->error('Cat not found', 404);
        }

        $validator = Validator::make($request->all(), $this->rules());

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors()->toArray());
        }

        $cat->update($this->mapData($validator->validated(), false));

        return $this->success($cat, 'Cat updated successfully');
    }

    public function destroy(string $id): JsonResponse
    {
        $cat = Cat::find($id);
        if (! $cat) {
            return $this->error('Cat not found', 404);
        }
        $cat->delete();

        return $this->success(null, 'Cat deleted successfully');
    }

    private function rules(): array
    {
        return [
            'customer_id' => 'required|exists:customers,customer_id',
            'name' => 'required|string|max:50',
            'breed' => 'nullable|string|max:50',
            'age_years' => 'nullable|numeric|min:0',
            'weight_kg' => 'nullable|numeric|min:0',
            'cat_id' => 'nullable|string|max:100',
            'vital_temperature' => 'nullable|numeric',
            'tempramen' => 'nullable|string|max:50',
            'medical_history' => 'nullable|string',
            'last_picture' => 'nullable|string|max:255',
        ];
    }

    private function mapData(array $validated, bool $isCreate): array
    {
        $data = [
            'customer_id' => $validated['customer_id'],
            'name' => $validated['name'],
            'breeds' => $validated['breed'] ?? '',
            'weight' => $validated['weight_kg'] ?? 0,
        ];

        if ($isCreate || array_key_exists('age_years', $validated)) {
            $data['age_years'] = $validated['age_years'] ?? null;
        }

        foreach (['cat_id', 'vital_temperature', 'tempramen', 'medical_history', 'last_picture'] as $field) {
            if (array_key_exists($field, $validated)) {
                $data[$field] = $validated[$field];
            }
        }

        return $data;
    }
}

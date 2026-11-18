<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        if (!$cat) {
            return $this->error('Cat not found', 404);
        }
        return $this->success($cat, 'Cat retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->all();
        if (empty($data['cat_id'])) {
            $data['cat_id'] = 'CAT-' . strtoupper(Str::random(8));
        }
        $cat = Cat::create($data);
        return $this->success($cat, 'Cat created successfully', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $cat = Cat::find($id);
        if (!$cat) {
            return $this->error('Cat not found', 404);
        }
        $cat->update($request->all());
        return $this->success($cat, 'Cat updated successfully');
    }

    public function destroy(string $id): JsonResponse
    {
        $cat = Cat::find($id);
        if (!$cat) {
            return $this->error('Cat not found', 404);
        }
        $cat->delete();
        return $this->success(null, 'Cat deleted successfully');
    }
}

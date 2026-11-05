<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\JsonView;
use App\Core\Request;
use App\Services\CatService;

final class CatController
{
    public function __construct(private CatService $catService) {}

    public function index(Request $request): never
    {
        JsonView::success(
            $this->catService->listCats(),
            'Cats retrieved successfully'
        );
    }

    public function show(Request $request, array $params): never
    {
        $id = $this->requireId($params, 'id');
        JsonView::success(
            $this->catService->getCat($id),
            'Cat retrieved successfully'
        );
    }

    public function store(Request $request): never
    {
        JsonView::success(
            $this->catService->createCat($request->body),
            'Cat created successfully',
            201
        );
    }

    public function update(Request $request, array $params): never
    {
        $id = $this->requireId($params, 'id');
        JsonView::success(
            $this->catService->updateCat($id, $request->body),
            'Cat updated successfully'
        );
    }

    public function destroy(Request $request, array $params): never
    {
        $id = $this->requireId($params, 'id');
        $this->catService->deleteCat($id);
        JsonView::success(null, 'Cat deleted successfully');
    }

    private function requireId(array $params, string $key): string
    {
        $id = trim((string) ($params[$key] ?? ''));
        if ($id === '') {
            JsonView::error('Cat ID is required', 400);
        }
        return $id;
    }
}

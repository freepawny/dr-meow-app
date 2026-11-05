<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\JsonView;

final class HealthController
{
    public function index(): never
    {
        JsonView::success(['status' => 'ok'], 'API health check passed');
    }
}

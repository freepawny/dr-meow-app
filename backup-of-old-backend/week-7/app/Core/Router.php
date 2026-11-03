<?php

declare(strict_types=1);

namespace App\Core;

final class Router
{
    /** @var array<int, array{method:string, pattern:string, handler:callable}> */
    private array $routes = [];

    public function get(string $pattern, callable $handler): void { $this->add('GET', $pattern, $handler); }
    public function post(string $pattern, callable $handler): void { $this->add('POST', $pattern, $handler); }
    public function put(string $pattern, callable $handler): void { $this->add('PUT', $pattern, $handler); }
    public function patch(string $pattern, callable $handler): void { $this->add('PATCH', $pattern, $handler); }
    public function delete(string $pattern, callable $handler): void { $this->add('DELETE', $pattern, $handler); }

    private function add(string $method, string $pattern, callable $handler): void
    {
        $this->routes[] = ['method' => $method, 'pattern' => $pattern, 'handler' => $handler];
    }

    public function dispatch(Request $request): never
    {
        $pathMatched = false;
        foreach ($this->routes as $route) {
            $regex = preg_replace_callback('/\\{([a-zA-Z_][a-zA-Z0-9_]*)\\}/', static fn(array $m): string => '(?P<' . $m[1] . '>[^/]+)', $route['pattern']);
            if (!preg_match('#^' . $regex . '/?$#', $request->path, $matches)) {
                continue;
            }
            $pathMatched = true;
            if ($request->method !== $route['method']) {
                continue;
            }
            $params = [];
            foreach ($matches as $key => $value) {
                if (is_string($key)) { $params[$key] = rawurldecode($value); }
            }
            ($route['handler'])($request, $params);
            JsonView::error('Handler did not return a response', 500);
        }

        if ($pathMatched) {
            header('Allow: ' . $this->allowedMethods($request->path));
            JsonView::error('Method not allowed', 405);
        }
        JsonView::error('Route not found', 404);
    }

    private function allowedMethods(string $path): string
    {
        $methods = [];
        foreach ($this->routes as $route) {
            $regex = preg_replace_callback('/\\{([a-zA-Z_][a-zA-Z0-9_]*)\\}/', static fn(array $m): string => '[^/]+', $route['pattern']);
            if (preg_match('#^' . $regex . '/?$#', $path)) { $methods[] = $route['method']; }
        }
        return implode(', ', array_unique($methods));
    }
}

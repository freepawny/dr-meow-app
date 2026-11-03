<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Service;

final class ServiceRepository implements ServiceRepositoryInterface
{
    public function __construct(private JsonDatabase $database) {}

    /** @return Service[] */
    public function findAll(bool $activeOnly = false): array
    {
        $data = $this->database->read();
        $rows = $data['services'] ?? [];
        $services = [];
        foreach ($rows as $row) {
            $service = Service::fromArray($row);
            if (!$activeOnly || $service->isActive()) { $services[] = $service; }
        }
        return $services;
    }

    public function findById(int $id): ?Service
    {
        foreach ($this->findAll() as $service) {
            if ($service->getId() === $id) { return $service; }
        }
        return null;
    }

    public function create(array $attributes): Service
    {
        $data = $this->database->read();
        $rows = $data['services'] ?? [];
        $ids = array_map(static fn(array $row): int => (int) ($row['id'] ?? 0), $rows);
        $attributes['id'] = $ids === [] ? 1 : max($ids) + 1;
        $service = Service::fromArray($attributes);
        $rows[] = $service->toArray();
        $data['services'] = $rows;
        $this->database->write($data);
        return $service;
    }

    public function update(int $id, array $attributes): ?Service
    {
        $data = $this->database->read();
        $rows = $data['services'] ?? [];
        foreach ($rows as $index => $row) {
            if ((int) ($row['id'] ?? 0) !== $id) { continue; }
            $merged = array_merge($row, $attributes, ['id' => $id]);
            $service = Service::fromArray($merged);
            $rows[$index] = $service->toArray();
            $data['services'] = $rows;
            $this->database->write($data);
            return $service;
        }
        return null;
    }

    public function delete(int $id): bool
    {
        $data = $this->database->read();
        $rows = $data['services'] ?? [];
        foreach ($rows as $index => $row) {
            if ((int) ($row['id'] ?? 0) === $id) {
                array_splice($rows, $index, 1);
                $data['services'] = $rows;
                $this->database->write($data);
                return true;
            }
        }
        return false;
    }
}

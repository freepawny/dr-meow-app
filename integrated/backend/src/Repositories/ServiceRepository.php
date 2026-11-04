<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Entities\Service;

final class ServiceRepository
{
    public function __construct(private JsonDatabase $database) {}

    /**
     * @return Service[]
     */
    public function findAll(bool $activeOnly = false, ?string $sizeTier = null): array
    {
        $data = $this->database->read();
        $rows = $data['services'] ?? [];
        $services = [];

        foreach ($rows as $row) {
            // Jika ada filter tier ukuran kucing, sesuaikan harga & ukuran
            if ($sizeTier !== null && isset($row['prices'][$sizeTier])) {
                $row['price'] = $row['prices'][$sizeTier];
                $row['size'] = $sizeTier === '<2'
                    ? 'Kecil (< 2 kg)'
                    : ($sizeTier === '>2' ? 'Sedang (> 2 kg)' : 'Besar (> 5 kg)');
            }

            $service = Service::fromArray($row);
            if (!$activeOnly || $service->isActive()) {
                $services[] = $service;
            }
        }

        return $services;
    }

    public function findById(string $id): ?Service
    {
        foreach ($this->findAll(false) as $service) {
            if ($service->getId() === $id) {
                return $service;
            }
        }
        return null;
    }

    public function create(array $attributes): Service
    {
        $data = $this->database->read();
        $rows = $data['services'] ?? [];

        if (empty($attributes['id'])) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $attributes['name'] ?? 'service'), '-'));
            $attributes['id'] = $slug ?: 'service-' . uniqid();
        }

        $service = Service::fromArray($attributes);
        $rows[] = $service->toArray();

        $data['services'] = $rows;
        $this->database->write($data);

        return $service;
    }

    public function update(string $id, array $attributes): ?Service
    {
        $data = $this->database->read();
        $rows = $data['services'] ?? [];

        foreach ($rows as $index => $row) {
            if ((string) ($row['id'] ?? '') !== $id) {
                continue;
            }

            $merged = array_merge($row, $attributes, ['id' => $id]);
            $service = Service::fromArray($merged);
            $rows[$index] = $service->toArray();

            $data['services'] = $rows;
            $this->database->write($data);

            return $service;
        }

        return null;
    }

    public function delete(string $id): bool
    {
        $data = $this->database->read();
        $rows = $data['services'] ?? [];

        foreach ($rows as $index => $row) {
            if ((string) ($row['id'] ?? '') === $id) {
                array_splice($rows, $index, 1);
                $data['services'] = $rows;
                $this->database->write($data);
                return true;
            }
        }

        return false;
    }
}

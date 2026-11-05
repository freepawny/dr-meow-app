<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Entities\Cat;

final class CatRepository
{
    public function __construct(
        private JsonDatabase $database
    ) {}

    /**
     * @return Cat[]
     */
    public function findAll(): array
    {
        $data = $this->database->read();
        $rows = $data['cats'] ?? [];

        $cats = [];

        foreach ($rows as $row) {
            $cats[] = Cat::fromArray($row);
        }

        return $cats;
    }

    public function findById(string $catId): ?Cat
    {
        foreach ($this->findAll() as $cat) {
            if ($cat->getCatId() === $catId) {
                return $cat;
            }
        }

        return null;
    }

    /**
     * @return Cat[]
     */
    public function findByCustomerId(string $customerId): array
    {
        $cats = [];

        foreach ($this->findAll() as $cat) {
            if ($cat->getCustomerId() === $customerId) {
                $cats[] = $cat;
            }
        }

        return $cats;
    }

    public function create(array $attributes): Cat
    {
        $data = $this->database->read();
        $rows = $data['cats'] ?? [];

        if (empty($attributes['cat_id'])) {
            $attributes['cat_id'] = $this->generateId();
        }

        $cat = Cat::fromArray($attributes);

        $rows[] = $cat->toArray();

        $data['cats'] = $rows;
        $this->database->write($data);

        return $cat;
    }

    public function update(
        string $catId,
        array $attributes
    ): ?Cat {
        $data = $this->database->read();
        $rows = $data['cats'] ?? [];

        foreach ($rows as $index => $row) {
            if (
                (string) ($row['cat_id'] ?? '')
                !== $catId
            ) {
                continue;
            }

            $merged = array_merge(
                $row,
                $attributes,
                ['cat_id' => $catId]
            );

            $cat = Cat::fromArray($merged);

            $rows[$index] = $cat->toArray();

            $data['cats'] = $rows;
            $this->database->write($data);

            return $cat;
        }

        return null;
    }

    public function delete(string $catId): bool
    {
        $data = $this->database->read();
        $rows = $data['cats'] ?? [];

        foreach ($rows as $index => $row) {
            if (
                (string) ($row['cat_id'] ?? '')
                !== $catId
            ) {
                continue;
            }

            array_splice($rows, $index, 1);

            $data['cats'] = $rows;
            $this->database->write($data);

            return true;
        }

        return false;
    }

    private function generateId(): string
    {
        return 'CAT-' . strtoupper(bin2hex(random_bytes(4)));
    }
}
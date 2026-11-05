<?php
declare(strict_types=1);

/**
 * Procedural JSON storage helper functions (Week 5 — Server-Side Procedural PHP).
 */

function readJsonDatabase(string $filePath): array
{
    if (!is_file($filePath)) {
        throw new RuntimeException('JSON database file not found: ' . $filePath);
    }

    $handle = fopen($filePath, 'rb');
    if ($handle === false) {
        throw new RuntimeException('Cannot open JSON database file.');
    }

    try {
        if (!flock($handle, LOCK_SH)) {
            throw new RuntimeException('Cannot lock JSON database for reading.');
        }
        $contents = stream_get_contents($handle);
        flock($handle, LOCK_UN);
    } finally {
        fclose($handle);
    }

    $data = json_decode($contents ?: '', true);
    if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
        throw new RuntimeException('Invalid JSON database format: ' . json_last_error_msg());
    }

    return $data;
}

function writeJsonDatabase(string $filePath, array $data): void
{
    $directory = dirname($filePath);
    if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
        throw new RuntimeException('Cannot create storage directory: ' . $directory);
    }

    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false) {
        throw new RuntimeException('Cannot encode JSON database.');
    }

    $handle = fopen($filePath, 'c+');
    if ($handle === false) {
        throw new RuntimeException('Cannot open JSON database for writing.');
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('Cannot lock JSON database for writing.');
        }
        ftruncate($handle, 0);
        rewind($handle);
        if (fwrite($handle, $json . PHP_EOL) === false) {
            throw new RuntimeException('Cannot write JSON database.');
        }
        fflush($handle);
        flock($handle, LOCK_UN);
    } finally {
        fclose($handle);
    }
}

<?php

namespace App\Services;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Log;

class EncryptionService
{
    /**
     * Encrypt sensitive data.
     */
    public function encrypt(mixed $value): string
    {
        return Crypt::encryptString(is_array($value) ? json_encode($value) : (string) $value);
    }

    /**
     * Decrypt sensitive data.
     */
    public function decrypt(string $encrypted): ?string
    {
        try {
            return Crypt::decryptString($encrypted);
        } catch (DecryptException $e) {
            Log::error('Decryption failed', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Decrypt and decode JSON data.
     */
    public function decryptArray(string $encrypted): ?array
    {
        $decrypted = $this->decrypt($encrypted);
        
        if ($decrypted === null) {
            return null;
        }

        $decoded = json_decode($decrypted, true);
        
        return is_array($decoded) ? $decoded : null;
    }

    /**
     * Hash sensitive data for comparison (one-way).
     */
    public function hash(string $value): string
    {
        return hash('sha256', $value . config('app.key'));
    }

    /**
     * Verify a value against its hash.
     */
    public function verifyHash(string $value, string $hash): bool
    {
        return hash_equals($this->hash($value), $hash);
    }

    /**
     * Mask sensitive data for display.
     */
    public function mask(string $value, int $visibleChars = 4, string $maskChar = '*'): string
    {
        $length = strlen($value);
        
        if ($length <= $visibleChars) {
            return str_repeat($maskChar, $length);
        }

        $masked = str_repeat($maskChar, $length - $visibleChars);
        
        return $masked . substr($value, -$visibleChars);
    }

    /**
     * Mask an email address.
     */
    public function maskEmail(string $email): string
    {
        $parts = explode('@', $email);
        
        if (count($parts) !== 2) {
            return $this->mask($email);
        }

        $local = $parts[0];
        $domain = $parts[1];

        if (strlen($local) <= 2) {
            $maskedLocal = $local[0] . str_repeat('*', strlen($local) - 1);
        } else {
            $maskedLocal = $local[0] . str_repeat('*', strlen($local) - 2) . substr($local, -1);
        }

        return $maskedLocal . '@' . $domain;
    }
}


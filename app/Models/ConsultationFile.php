<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ConsultationFile extends Model
{
    use HasFactory;

    /**
     * Allowed file types for upload.
     */
    public const ALLOWED_MIME_TYPES = [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/javascript',
        'text/x-java-source',
        'text/x-python',
        'text/x-php',
        'text/html',
        'text/css',
        'application/sql',
        'text/x-sql',
    ];

    /**
     * Maximum file size in bytes (10MB).
     */
    public const MAX_FILE_SIZE = 10 * 1024 * 1024;

    protected $fillable = [
        'consultation_id',
        'uploaded_by',
        'original_name',
        'stored_name',
        'mime_type',
        'size',
        'path',
        'is_scanned',
        'is_safe',
    ];

    protected function casts(): array
    {
        return [
            'size' => 'integer',
            'is_scanned' => 'boolean',
            'is_safe' => 'boolean',
        ];
    }

    /**
     * Get the consultation.
     */
    public function consultation(): BelongsTo
    {
        return $this->belongsTo(Consultation::class);
    }

    /**
     * Get the user who uploaded the file.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Get the file URL.
     */
    public function getUrlAttribute(): string
    {
        return Storage::url($this->path);
    }

    /**
     * Get human-readable file size.
     */
    public function getHumanSizeAttribute(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ConsultationFile.php' . $units[$i];
    }

    /**
     * Check if file type is allowed.
     */
    public static function isAllowedMimeType(string $mimeType): bool
    {
        return in_array($mimeType, self::ALLOWED_MIME_TYPES);
    }

    /**
     * Check if file size is within limit.
     */
    public static function isWithinSizeLimit(int $size): bool
    {
        return $size <= self::MAX_FILE_SIZE;
    }

    /**
     * Scope for safe files.
     */
    public function scopeSafe($query)
    {
        return $query->where('is_scanned', true)->where('is_safe', true);
    }
}


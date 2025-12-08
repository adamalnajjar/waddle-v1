<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsultationMessage extends Model
{
    use HasFactory;

    public const TYPE_TEXT = 'text';
    public const TYPE_FILE = 'file';
    public const TYPE_CODE_SNIPPET = 'code_snippet';

    protected $fillable = [
        'consultation_id',
        'user_id',
        'message',
        'type',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
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
     * Get the user who sent the message.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if message is a code snippet.
     */
    public function isCodeSnippet(): bool
    {
        return $this->type === self::TYPE_CODE_SNIPPET;
    }

    /**
     * Get the code language if this is a code snippet.
     */
    public function getCodeLanguageAttribute(): ?string
    {
        if (!$this->isCodeSnippet()) {
            return null;
        }
        
        return $this->metadata['language'] ?? null;
    }
}


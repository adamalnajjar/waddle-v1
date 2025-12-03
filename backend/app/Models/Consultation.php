<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Consultation extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_NO_SHOW = 'no_show';

    protected $fillable = [
        'consultation_request_id',
        'user_id',
        'consultant_id',
        'zoom_meeting_id',
        'zoom_join_url',
        'zoom_start_url',
        'status',
        'started_at',
        'ended_at',
        'duration_minutes',
        'tokens_charged',
        'token_rate_per_minute',
        'notes',
        'user_rating',
        'user_feedback',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
            'duration_minutes' => 'integer',
            'tokens_charged' => 'integer',
            'token_rate_per_minute' => 'decimal:2',
            'user_rating' => 'integer',
        ];
    }

    /**
     * Get the consultation request.
     */
    public function consultationRequest(): BelongsTo
    {
        return $this->belongsTo(ConsultationRequest::class);
    }

    /**
     * Get the user (client).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the consultant.
     */
    public function consultant(): BelongsTo
    {
        return $this->belongsTo(Consultant::class);
    }

    /**
     * Get the messages for this consultation.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(ConsultationMessage::class);
    }

    /**
     * Get the files for this consultation.
     */
    public function files(): HasMany
    {
        return $this->hasMany(ConsultationFile::class);
    }

    /**
     * Get the token transactions for this consultation.
     */
    public function tokenTransactions(): HasMany
    {
        return $this->hasMany(TokenTransaction::class);
    }

    /**
     * Check if consultation is active.
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_IN_PROGRESS;
    }

    /**
     * Check if consultation can be started.
     */
    public function canStart(): bool
    {
        return $this->status === self::STATUS_SCHEDULED;
    }

    /**
     * Check if consultation can be ended.
     */
    public function canEnd(): bool
    {
        return $this->status === self::STATUS_IN_PROGRESS;
    }

    /**
     * Calculate duration in minutes.
     */
    public function calculateDuration(): int
    {
        if (!$this->started_at || !$this->ended_at) {
            return 0;
        }
        
        return $this->started_at->diffInMinutes($this->ended_at);
    }

    /**
     * Calculate tokens to charge based on duration.
     */
    public function calculateTokensToCharge(): int
    {
        $duration = $this->duration_minutes ?? $this->calculateDuration();
        return (int) ceil($duration * $this->token_rate_per_minute);
    }

    /**
     * Scope for active consultations.
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_IN_PROGRESS);
    }

    /**
     * Scope for completed consultations.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    /**
     * Scope for a specific user.
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for a specific consultant.
     */
    public function scopeForConsultant($query, int $consultantId)
    {
        return $query->where('consultant_id', $consultantId);
    }
}


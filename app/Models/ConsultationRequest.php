<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ConsultationRequest extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUS_PENDING = 'pending';
    public const STATUS_MATCHING = 'matching';
    public const STATUS_INVITED = 'invited';
    public const STATUS_MATCHED = 'matched';
    public const STATUS_TIME_PROPOSED = 'time_proposed';
    public const STATUS_TIME_COUNTER_PROPOSED = 'time_counter_proposed';
    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_READY = 'ready';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    public const MAX_SHUFFLES = 3;

    protected $fillable = [
        'user_id',
        'problem_description',
        'tech_stack',
        'error_logs',
        'questionnaire_responses',
        'status',
        'matched_consultant_id',
        'shuffle_count',
        'excluded_consultants',
        'matched_at',
        'proposed_time',
        'counter_proposed_time',
        'counter_proposal_reason',
        'proposal_rounds',
        'agreed_time',
        'user_confirmed',
        'consultant_confirmed',
        'zoom_meeting_id',
        'zoom_join_url',
        'zoom_password',
        'zoom_created_at',
    ];

    protected function casts(): array
    {
        return [
            'tech_stack' => 'array',
            'questionnaire_responses' => 'array',
            'excluded_consultants' => 'array',
            'shuffle_count' => 'integer',
            'matched_at' => 'datetime',
            'proposed_time' => 'datetime',
            'counter_proposed_time' => 'datetime',
            'agreed_time' => 'datetime',
            'zoom_created_at' => 'datetime',
            'user_confirmed' => 'boolean',
            'consultant_confirmed' => 'boolean',
            'proposal_rounds' => 'integer',
        ];
    }

    /**
     * Get the user that created the request.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the matched consultant.
     */
    public function matchedConsultant(): BelongsTo
    {
        return $this->belongsTo(Consultant::class, 'matched_consultant_id');
    }

    /**
     * Get the consultation created from this request.
     */
    public function consultation(): HasOne
    {
        return $this->hasOne(Consultation::class);
    }

    /**
     * Check if shuffle is allowed.
     */
    public function canShuffle(): bool
    {
        return $this->shuffle_count < self::MAX_SHUFFLES 
            && in_array($this->status, [self::STATUS_MATCHED, self::STATUS_MATCHING]);
    }

    /**
     * Get remaining shuffles.
     */
    public function getRemainingShufflesAttribute(): int
    {
        return max(0, self::MAX_SHUFFLES - $this->shuffle_count);
    }

    /**
     * Add consultant to excluded list.
     */
    public function excludeConsultant(int $consultantId): void
    {
        $excluded = $this->excluded_consultants ?? [];
        if (!in_array($consultantId, $excluded)) {
            $excluded[] = $consultantId;
            $this->excluded_consultants = $excluded;
        }
    }

    /**
     * Scope for pending requests.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for active requests (not completed or cancelled).
     */
    public function scopeActive($query)
    {
        return $query->whereNotIn('status', [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }
}


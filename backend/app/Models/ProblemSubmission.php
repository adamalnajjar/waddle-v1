<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ProblemSubmission extends Model
{
    use HasFactory;

    /**
     * Status constants
     */
    public const STATUS_DRAFT = 'draft';
    public const STATUS_SUBMITTED = 'submitted';
    public const STATUS_MATCHING = 'matching';
    public const STATUS_MATCHED = 'matched';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_REFUNDED = 'refunded';
    public const STATUS_CANCELLED = 'cancelled';

    /**
     * Submission fee constants
     */
    public const MIN_SUBMISSION_FEE = 5;
    public const MAX_SUBMISSION_FEE = 10;

    /**
     * Draft expiry in days
     */
    public const DRAFT_EXPIRY_DAYS = 14;

    protected $fillable = [
        'user_id',
        'problem_statement',
        'error_description',
        'status',
        'submission_fee',
        'draft_expires_at',
        'submitted_at',
        'refunded_at',
    ];

    protected function casts(): array
    {
        return [
            'submission_fee' => 'integer',
            'draft_expires_at' => 'datetime',
            'submitted_at' => 'datetime',
            'refunded_at' => 'datetime',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($submission) {
            // Set draft expiry when creating a draft
            if ($submission->status === self::STATUS_DRAFT && !$submission->draft_expires_at) {
                $submission->draft_expires_at = Carbon::now()->addDays(self::DRAFT_EXPIRY_DAYS);
            }
        });
    }

    /**
     * Get the user that owns the submission.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the technologies for this submission.
     */
    public function technologies()
    {
        return $this->belongsToMany(Technology::class, 'problem_technologies')
            ->withPivot('is_custom', 'custom_name')
            ->withTimestamps();
    }

    /**
     * Get the attachments for this submission.
     */
    public function attachments()
    {
        return $this->hasMany(ProblemAttachment::class);
    }

    /**
     * Get the consultant invitations for this submission.
     */
    public function invitations()
    {
        return $this->hasMany(ConsultantInvitation::class);
    }

    /**
     * Scope for draft submissions.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', self::STATUS_DRAFT);
    }

    /**
     * Scope for submitted (pending matching) submissions.
     */
    public function scopeSubmitted($query)
    {
        return $query->where('status', self::STATUS_SUBMITTED);
    }

    /**
     * Scope for expired drafts.
     */
    public function scopeExpiredDrafts($query)
    {
        return $query->where('status', self::STATUS_DRAFT)
            ->where('draft_expires_at', '<', Carbon::now());
    }

    /**
     * Check if this is a draft.
     */
    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    /**
     * Check if the draft has expired.
     */
    public function isDraftExpired(): bool
    {
        return $this->isDraft() && $this->draft_expires_at && $this->draft_expires_at->isPast();
    }

    /**
     * Check if this can be edited.
     */
    public function canEdit(): bool
    {
        return $this->isDraft() && !$this->isDraftExpired();
    }

    /**
     * Check if this can be submitted.
     */
    public function canSubmit(): bool
    {
        return $this->isDraft() && !$this->isDraftExpired() && !empty($this->problem_statement);
    }

    /**
     * Check if this has been refunded.
     */
    public function isRefunded(): bool
    {
        return $this->status === self::STATUS_REFUNDED && $this->refunded_at !== null;
    }

    /**
     * Calculate the submission fee based on content.
     */
    public function calculateSubmissionFee(): int
    {
        $baseFee = self::MIN_SUBMISSION_FEE;
        $additionalFee = 0;

        // Add fee based on problem statement length
        $problemLength = strlen($this->problem_statement ?? '');
        if ($problemLength > 500) {
            $additionalFee += 1;
        }
        if ($problemLength > 1000) {
            $additionalFee += 1;
        }

        // Add fee based on error description length
        $errorLength = strlen($this->error_description ?? '');
        if ($errorLength > 500) {
            $additionalFee += 1;
        }
        if ($errorLength > 1000) {
            $additionalFee += 1;
        }

        // Add fee based on attachments
        $attachmentCount = $this->attachments()->count();
        if ($attachmentCount > 0) {
            $additionalFee += min($attachmentCount, 2); // Max 2 additional tokens for attachments
        }

        return min($baseFee + $additionalFee, self::MAX_SUBMISSION_FEE);
    }

    /**
     * Submit this problem.
     */
    public function submit(): bool
    {
        if (!$this->canSubmit()) {
            return false;
        }

        // Calculate and set the final submission fee
        $this->submission_fee = $this->calculateSubmissionFee();
        $this->status = self::STATUS_SUBMITTED;
        $this->submitted_at = Carbon::now();
        $this->draft_expires_at = null; // Clear draft expiry

        return $this->save();
    }

    /**
     * Refund this submission.
     */
    public function refund(): bool
    {
        if ($this->isRefunded()) {
            return false; // Already refunded
        }

        $this->status = self::STATUS_REFUNDED;
        $this->refunded_at = Carbon::now();

        if ($this->save()) {
            // Add tokens back to user
            $this->user->increment('tokens_balance', $this->submission_fee);
            return true;
        }

        return false;
    }
}


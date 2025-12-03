<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ConsultantInvitation extends Model
{
    use HasFactory;

    /**
     * Status constants
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_DECLINED = 'declined';
    public const STATUS_EXPIRED = 'expired';

    /**
     * Invitation expiry hours
     */
    public const EXPIRY_HOURS = 24;

    /**
     * Surge pay multiplier
     */
    public const SURGE_MULTIPLIER = 1.2;

    protected $fillable = [
        'problem_submission_id',
        'consultant_id',
        'invited_by',
        'status',
        'is_surge',
        'surge_multiplier',
        'invited_at',
        'responded_at',
        'expires_at',
        'decline_reason',
    ];

    protected function casts(): array
    {
        return [
            'is_surge' => 'boolean',
            'surge_multiplier' => 'decimal:2',
            'invited_at' => 'datetime',
            'responded_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Alias for is_surge to support both naming conventions.
     */
    public function getIsSurgePricingAttribute(): bool
    {
        return $this->is_surge;
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invitation) {
            if (!$invitation->invited_at) {
                $invitation->invited_at = Carbon::now();
            }
            if (!$invitation->expires_at) {
                $invitation->expires_at = Carbon::now()->addHours(self::EXPIRY_HOURS);
            }
        });
    }

    /**
     * Get the problem submission.
     */
    public function problemSubmission()
    {
        return $this->belongsTo(ProblemSubmission::class);
    }

    /**
     * Get the consultant.
     */
    public function consultant()
    {
        return $this->belongsTo(Consultant::class);
    }

    /**
     * Get the admin who sent the invite.
     */
    public function invitedBy()
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    /**
     * Scope for pending invitations.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for expired invitations.
     */
    public function scopeExpired($query)
    {
        return $query->where('status', self::STATUS_PENDING)
            ->where('expires_at', '<', Carbon::now());
    }

    /**
     * Scope for active (not expired) pending invitations.
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_PENDING)
            ->where('expires_at', '>', Carbon::now());
    }

    /**
     * Check if this invitation is pending.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if this invitation has expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if this invitation can be responded to.
     */
    public function canRespond(): bool
    {
        return $this->isPending() && !$this->isExpired();
    }

    /**
     * Accept this invitation.
     */
    public function accept(): bool
    {
        if (!$this->canRespond()) {
            return false;
        }

        $this->status = self::STATUS_ACCEPTED;
        $this->responded_at = Carbon::now();

        if ($this->save()) {
            // Update the problem submission status
            $this->problemSubmission->update(['status' => ProblemSubmission::STATUS_MATCHED]);
            
            // Expire other pending invitations for this problem
            self::where('problem_submission_id', $this->problem_submission_id)
                ->where('id', '!=', $this->id)
                ->where('status', self::STATUS_PENDING)
                ->update(['status' => self::STATUS_EXPIRED]);

            return true;
        }

        return false;
    }

    /**
     * Decline this invitation.
     */
    public function decline(?string $reason = null): bool
    {
        if (!$this->canRespond()) {
            return false;
        }

        $this->status = self::STATUS_DECLINED;
        $this->responded_at = Carbon::now();
        $this->decline_reason = $reason;

        return $this->save();
    }

    /**
     * Mark as expired.
     */
    public function markExpired(): bool
    {
        if ($this->status !== self::STATUS_PENDING) {
            return false;
        }

        $this->status = self::STATUS_EXPIRED;
        return $this->save();
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Consultant extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_SUSPENDED = 'suspended';

    protected $fillable = [
        'user_id',
        'specializations',
        'bio',
        'languages',
        'hourly_rate',
        'status',
        'is_available',
        'is_surge_available',
        'notification_start_time',
        'notification_end_time',
        'vetting_documents',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'specializations' => 'array',
            'languages' => 'array',
            'vetting_documents' => 'array',
            'is_available' => 'boolean',
            'is_surge_available' => 'boolean',
            'hourly_rate' => 'decimal:2',
            'approved_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the consultant profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the availability slots for the consultant.
     */
    public function availability(): HasMany
    {
        return $this->hasMany(ConsultantAvailability::class);
    }

    /**
     * Get the consultations for the consultant.
     */
    public function consultations(): HasMany
    {
        return $this->hasMany(Consultation::class);
    }

    /**
     * Get the consultation requests matched to this consultant.
     */
    public function consultationRequests(): HasMany
    {
        return $this->hasMany(ConsultationRequest::class, 'matched_consultant_id');
    }

    /**
     * Check if consultant is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    /**
     * Check if consultant is available for consultations.
     */
    public function isAvailableForConsultation(): bool
    {
        return $this->isApproved() && $this->is_available;
    }

    /**
     * Scope for approved consultants.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * Scope for available consultants.
     */
    public function scopeAvailable($query)
    {
        return $query->approved()->where('is_available', true);
    }

    /**
     * Scope for consultants with specific specialization.
     */
    public function scopeWithSpecialization($query, string $specialization)
    {
        return $query->whereJsonContains('specializations', $specialization);
    }

    /**
     * Get the technologies this consultant is proficient in.
     */
    public function technologies()
    {
        return $this->belongsToMany(Technology::class, 'consultant_technologies')
            ->withTimestamps();
    }

    /**
     * Get the work invitations for this consultant.
     */
    public function invitations()
    {
        return $this->hasMany(ConsultantInvitation::class);
    }

    /**
     * Get pending invitations.
     */
    public function pendingInvitations()
    {
        return $this->invitations()->pending()->active();
    }

    /**
     * Scope for surge-available consultants.
     */
    public function scopeSurgeAvailable($query)
    {
        return $query->where('is_surge_available', true);
    }

    /**
     * Check if consultant is within their notification hours.
     */
    public function isWithinNotificationHours(): bool
    {
        $now = now();
        $start = $now->copy()->setTimeFromTimeString($this->notification_start_time ?? '09:00:00');
        $end = $now->copy()->setTimeFromTimeString($this->notification_end_time ?? '17:00:00');

        return $now->between($start, $end);
    }

    /**
     * Check if consultant should be notified about a problem.
     */
    public function shouldNotify(bool $isSurge = false): bool
    {
        if (!$this->isAvailableForConsultation()) {
            return false;
        }

        // Within normal hours - always notify
        if ($this->isWithinNotificationHours()) {
            return true;
        }

        // Outside normal hours - only notify if surge and opt-in
        return $isSurge && $this->is_surge_available;
    }
}


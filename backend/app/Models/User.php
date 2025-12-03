<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements MustVerifyEmail, FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * User roles
     */
    public const ROLE_USER = 'user';
    public const ROLE_CONSULTANT = 'consultant';
    public const ROLE_ADMIN = 'admin';

    /**
     * Development competency levels
     */
    public const COMPETENCY_BEGINNER = 'beginner';
    public const COMPETENCY_INTERMEDIATE = 'intermediate';
    public const COMPETENCY_ADVANCED = 'advanced';
    public const COMPETENCY_SENIOR = 'senior';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'date_of_birth',
        'email',
        'password',
        'role',
        'tokens_balance',
        'email_verified_at',
        'two_factor_secret',
        'two_factor_enabled',
        'bio',
        'profile_photo_path',
        'development_competency',
        'profile_completed_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_enabled' => 'boolean',
            'tokens_balance' => 'integer',
            'date_of_birth' => 'date',
            'profile_completed_at' => 'datetime',
        ];
    }

    /**
     * Check if the user has completed their profile.
     */
    public function hasCompletedProfile(): bool
    {
        return $this->profile_completed_at !== null;
    }

    /**
     * Check if the user needs to complete their profile.
     */
    public function needsProfileCompletion(): bool
    {
        return $this->profile_completed_at === null;
    }

    /**
     * Mark the profile as completed.
     */
    public function markProfileCompleted(): void
    {
        $this->update(['profile_completed_at' => now()]);
    }

    /**
     * Get the profile photo URL.
     */
    public function getProfilePhotoUrlAttribute(): ?string
    {
        if ($this->profile_photo_path) {
            return asset('storage/' . $this->profile_photo_path);
        }
        return null;
    }

    /**
     * Determine if the user can access the Filament admin panel.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * Check if user is a consultant.
     */
    public function isConsultant(): bool
    {
        return $this->role === self::ROLE_CONSULTANT;
    }

    /**
     * Check if user is a regular user.
     */
    public function isUser(): bool
    {
        return $this->role === self::ROLE_USER;
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get the consultant profile associated with the user.
     */
    public function consultantProfile()
    {
        return $this->hasOne(Consultant::class);
    }

    /**
     * Get the subscription associated with the user.
     */
    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }

    /**
     * Get the token transactions for the user.
     */
    public function tokenTransactions()
    {
        return $this->hasMany(TokenTransaction::class);
    }

    /**
     * Get the consultation requests for the user.
     */
    public function consultationRequests()
    {
        return $this->hasMany(ConsultationRequest::class);
    }

    /**
     * Get the consultations for the user.
     */
    public function consultations()
    {
        return $this->hasMany(Consultation::class);
    }

    /**
     * Get the notification preferences for the user.
     */
    public function notificationPreferences()
    {
        return $this->hasMany(NotificationPreference::class);
    }

    /**
     * Get the Stripe customer associated with the user.
     */
    public function stripeCustomer()
    {
        return $this->hasOne(StripeCustomer::class);
    }

    /**
     * Check if user has an active subscription.
     */
    public function hasActiveSubscription(): bool
    {
        return $this->subscription && $this->subscription->isActive();
    }

    /**
     * Get the problem submissions for the user.
     */
    public function problemSubmissions()
    {
        return $this->hasMany(ProblemSubmission::class);
    }

    /**
     * Get the user's draft problem submissions.
     */
    public function draftProblems()
    {
        return $this->problemSubmissions()->where('status', 'draft');
    }
}

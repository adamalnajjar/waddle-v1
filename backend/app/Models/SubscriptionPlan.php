<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    use HasFactory, SoftDeletes;

    public const BILLING_MONTHLY = 'monthly';
    public const BILLING_YEARLY = 'yearly';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'billing_period',
        'token_discount_percentage',
        'priority_matching',
        'features',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'token_discount_percentage' => 'integer',
            'priority_matching' => 'boolean',
            'features' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the subscriptions for this plan.
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Scope for active plans.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Calculate discounted price for tokens.
     */
    public function calculateDiscountedTokenPrice(float $originalPrice): float
    {
        if ($this->token_discount_percentage <= 0) {
            return $originalPrice;
        }
        
        return $originalPrice * (1 - ($this->token_discount_percentage / 100));
    }
}


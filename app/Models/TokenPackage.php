<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TokenPackage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'token_amount',
        'price',
        'subscriber_price',
        'stripe_price_id',
        'stripe_subscriber_price_id',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'token_amount' => 'integer',
            'price' => 'decimal:2',
            'subscriber_price' => 'decimal:2',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Get the transactions for this package.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(TokenTransaction::class);
    }

    /**
     * Get the price per token.
     */
    public function getPricePerTokenAttribute(): float
    {
        return $this->token_amount > 0 ? $this->price / $this->token_amount : 0;
    }

    /**
     * Get the subscriber price per token.
     */
    public function getSubscriberPricePerTokenAttribute(): ?float
    {
        if (!$this->subscriber_price || $this->token_amount <= 0) {
            return null;
        }
        
        return $this->subscriber_price / $this->token_amount;
    }

    /**
     * Get the appropriate price for a user.
     */
    public function getPriceForUser(User $user): float
    {
        if ($user->hasActiveSubscription() && $this->subscriber_price) {
            return $this->subscriber_price;
        }
        
        return $this->price;
    }

    /**
     * Get the appropriate Stripe price ID for a user.
     */
    public function getStripePriceIdForUser(User $user): ?string
    {
        if ($user->hasActiveSubscription() && $this->stripe_subscriber_price_id) {
            return $this->stripe_subscriber_price_id;
        }
        
        return $this->stripe_price_id;
    }

    /**
     * Scope for active packages.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for featured packages.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope ordered by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('price');
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StripeCustomer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'stripe_customer_id',
        'default_payment_method_id',
    ];

    /**
     * Get the user that owns the Stripe customer.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}


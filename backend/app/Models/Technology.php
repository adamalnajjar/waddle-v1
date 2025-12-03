<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Technology extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon_url',
        'is_active',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($technology) {
            if (empty($technology->slug)) {
                $technology->slug = Str::slug($technology->name);
            }
        });
    }

    /**
     * Scope for active technologies.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordered technologies.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order')->orderBy('name');
    }

    /**
     * Get problem submissions using this technology.
     */
    public function problemSubmissions()
    {
        return $this->belongsToMany(ProblemSubmission::class, 'problem_technologies')
            ->withPivot('is_custom', 'custom_name')
            ->withTimestamps();
    }

    /**
     * Get consultants proficient in this technology.
     */
    public function consultants()
    {
        return $this->belongsToMany(Consultant::class, 'consultant_technologies')
            ->withTimestamps();
    }
}


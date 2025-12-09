<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\TokenPackage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed technologies first
        $this->call(TechnologySeeder::class);

        // Create admin user
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'username' => 'admin',
            'email' => 'admin@waddle.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'tokens_balance' => 0,
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);

        // Create test user
        User::create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'username' => 'testuser',
            'email' => 'user@waddle.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'tokens_balance' => 100,
            'email_verified_at' => now(),
            'bio' => 'A test user exploring the platform.',
            'development_competency' => 'intermediate',
            'profile_completed_at' => now(),
        ]);

        // Create test consultant
        $consultantUser = User::create([
            'first_name' => 'Expert',
            'last_name' => 'Consultant',
            'username' => 'expertdev',
            'email' => 'consultant@waddle.com',
            'password' => Hash::make('password'),
            'role' => 'consultant',
            'tokens_balance' => 0,
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
        ]);

        // Create consultant profile
        $consultantUser->consultantProfile()->create([
            'specializations' => ['Laravel', 'React', 'TypeScript', 'AWS', 'PostgreSQL'],
            'bio' => 'Senior full-stack developer with 10+ years of experience in web development.',
            'languages' => ['English', 'Spanish'],
            'hourly_rate' => 150.00,
            'status' => 'approved',
            'is_available' => true,
            'approved_at' => now(),
        ]);

        // Create subscription plans (prices in GBP)
        SubscriptionPlan::create([
            'name' => 'Basic',
            'slug' => 'basic',
            'description' => 'Perfect for occasional consultations',
            'price' => 7.99,
            'billing_period' => 'monthly',
            'token_discount_percentage' => 5,
            'priority_matching' => false,
            'features' => [
                '5% discount on token purchases',
                'Email support',
                'Access to all consultants',
            ],
            'is_active' => true,
        ]);

        SubscriptionPlan::create([
            'name' => 'Pro',
            'slug' => 'pro',
            'description' => 'For developers who need regular help',
            'price' => 24.99,
            'billing_period' => 'monthly',
            'token_discount_percentage' => 15,
            'priority_matching' => true,
            'features' => [
                '15% discount on token purchases',
                'Priority matching',
                'Priority support',
                'Access to premium consultants',
            ],
            'is_active' => true,
        ]);

        SubscriptionPlan::create([
            'name' => 'Enterprise',
            'slug' => 'enterprise',
            'description' => 'For teams and businesses',
            'price' => 79.99,
            'billing_period' => 'monthly',
            'token_discount_percentage' => 25,
            'priority_matching' => true,
            'features' => [
                '25% discount on token purchases',
                'Priority matching',
                'Dedicated support',
                'Custom consultant pool',
                'Team management',
                'Usage analytics',
            ],
            'is_active' => true,
        ]);

        // Create token packages (prices in GBP)
        TokenPackage::create([
            'name' => 'Starter Pack',
            'description' => 'Perfect for trying out the platform',
            'token_amount' => 10,
            'price' => 7.99,
            'subscriber_price' => 6.99,
            'is_featured' => false,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        TokenPackage::create([
            'name' => 'Popular Pack',
            'description' => 'Our most popular choice',
            'token_amount' => 50,
            'price' => 35.99,
            'subscriber_price' => 31.99,
            'is_featured' => true,
            'is_active' => true,
            'sort_order' => 2,
        ]);

        TokenPackage::create([
            'name' => 'Power Pack',
            'description' => 'Best value for regular users',
            'token_amount' => 100,
            'price' => 63.99,
            'subscriber_price' => 55.99,
            'is_featured' => false,
            'is_active' => true,
            'sort_order' => 3,
        ]);

        TokenPackage::create([
            'name' => 'Enterprise Pack',
            'description' => 'For heavy users and teams',
            'token_amount' => 500,
            'price' => 279.99,
            'subscriber_price' => 239.99,
            'is_featured' => false,
            'is_active' => true,
            'sort_order' => 4,
        ]);
    }
}

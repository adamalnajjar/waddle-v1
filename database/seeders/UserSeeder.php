<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's users.
     */
    public function run(): void
    {
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
    }
}

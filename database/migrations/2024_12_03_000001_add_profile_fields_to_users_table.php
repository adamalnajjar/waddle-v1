<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->after('last_name');
            $table->date('date_of_birth')->nullable()->after('username');
            $table->text('bio')->nullable()->after('date_of_birth');
            $table->string('profile_photo_path')->nullable()->after('bio');
            $table->enum('development_competency', ['beginner', 'intermediate', 'advanced', 'senior'])
                ->nullable()
                ->after('profile_photo_path');
            $table->timestamp('profile_completed_at')->nullable()->after('development_competency');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username',
                'date_of_birth',
                'bio',
                'profile_photo_path',
                'development_competency',
                'profile_completed_at',
            ]);
        });
    }
};


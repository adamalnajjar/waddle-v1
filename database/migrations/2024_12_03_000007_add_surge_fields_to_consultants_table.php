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
        Schema::table('consultants', function (Blueprint $table) {
            $table->boolean('is_surge_available')->default(false)->after('is_available');
            $table->time('notification_start_time')->default('09:00:00')->after('is_surge_available');
            $table->time('notification_end_time')->default('17:00:00')->after('notification_start_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultants', function (Blueprint $table) {
            $table->dropColumn([
                'is_surge_available',
                'notification_start_time',
                'notification_end_time',
            ]);
        });
    }
};


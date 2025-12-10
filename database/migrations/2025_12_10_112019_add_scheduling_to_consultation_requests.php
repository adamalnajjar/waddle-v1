<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('consultation_requests', function (Blueprint $table) {
            // Scheduling fields
            $table->timestamp('proposed_time')->nullable()->after('matched_at');
            $table->timestamp('counter_proposed_time')->nullable()->after('proposed_time');
            $table->string('counter_proposal_reason')->nullable()->after('counter_proposed_time');
            $table->integer('proposal_rounds')->default(0)->after('counter_proposal_reason');
            $table->timestamp('agreed_time')->nullable()->after('proposal_rounds');
            $table->boolean('user_confirmed')->default(false)->after('agreed_time');
            $table->boolean('consultant_confirmed')->default(false)->after('user_confirmed');
            
            // Zoom meeting details
            $table->string('zoom_meeting_id')->nullable()->after('consultant_confirmed');
            $table->text('zoom_join_url')->nullable()->after('zoom_meeting_id');
            $table->string('zoom_password')->nullable()->after('zoom_join_url');
            $table->timestamp('zoom_created_at')->nullable()->after('zoom_password');
            
            $table->index('agreed_time');
        });
        
        // Update status enum to include new statuses
        DB::statement("ALTER TABLE consultation_requests MODIFY COLUMN status ENUM('pending', 'matching', 'invited', 'matched', 'time_proposed', 'time_counter_proposed', 'scheduled', 'ready', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultation_requests', function (Blueprint $table) {
            $table->dropColumn([
                'proposed_time',
                'counter_proposed_time',
                'counter_proposal_reason',
                'proposal_rounds',
                'agreed_time',
                'user_confirmed',
                'consultant_confirmed',
                'zoom_meeting_id',
                'zoom_join_url',
                'zoom_password',
                'zoom_created_at',
            ]);
        });
        
        // Revert status enum to original values
        DB::statement("ALTER TABLE consultation_requests MODIFY COLUMN status ENUM('pending', 'matching', 'matched', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending'");
    }
};

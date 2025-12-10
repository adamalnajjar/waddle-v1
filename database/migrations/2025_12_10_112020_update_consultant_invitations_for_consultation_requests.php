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
        Schema::table('consultant_invitations', function (Blueprint $table) {
            // Make problem_submission_id nullable for backward compatibility
            $table->foreignId('problem_submission_id')->nullable()->change();
            
            // Add consultation_request_id (keep problem_submission_id for now for backward compatibility)
            $table->foreignId('consultation_request_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            
            // Add scheduling fields
            $table->timestamp('proposed_time')->nullable()->after('responded_at');
            $table->string('proposal_message')->nullable()->after('proposed_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultant_invitations', function (Blueprint $table) {
            $table->dropForeign(['consultation_request_id']);
            $table->dropColumn([
                'consultation_request_id',
                'proposed_time',
                'proposal_message',
            ]);
        });
    }
};

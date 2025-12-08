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
        Schema::create('consultant_invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('problem_submission_id')->constrained()->onDelete('cascade');
            $table->foreignId('consultant_id')->constrained()->onDelete('cascade');
            $table->foreignId('invited_by')->constrained('users')->onDelete('cascade'); // Admin who sent invite
            $table->enum('status', ['pending', 'accepted', 'declined', 'expired'])->default('pending');
            $table->boolean('is_surge')->default(false); // Surge pricing invitation
            $table->timestamp('invited_at')->useCurrent();
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('expires_at')->useCurrent(); // 24 hours from invited_at
            $table->text('decline_reason')->nullable();
            $table->timestamps();

            $table->index('problem_submission_id');
            $table->index('consultant_id');
            $table->index('status');
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultant_invitations');
    }
};


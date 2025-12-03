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
        Schema::create('problem_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('problem_statement');
            $table->text('error_description')->nullable();
            $table->enum('status', [
                'draft',
                'submitted',
                'matching',      // Admin is reviewing/matching
                'matched',       // Consultant has been invited
                'in_progress',   // Consultation in progress
                'completed',
                'refunded',
                'cancelled'
            ])->default('draft');
            $table->unsignedInteger('submission_fee')->default(5); // tokens
            $table->timestamp('draft_expires_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('user_id');
            $table->index('draft_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('problem_submissions');
    }
};


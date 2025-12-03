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
        Schema::create('consultation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('problem_description');
            $table->json('tech_stack')->nullable();
            $table->text('error_logs')->nullable();
            $table->json('questionnaire_responses')->nullable();
            $table->enum('status', ['pending', 'matching', 'matched', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->foreignId('matched_consultant_id')->nullable()->constrained('consultants')->nullOnDelete();
            $table->integer('shuffle_count')->default(0);
            $table->json('excluded_consultants')->nullable(); // Consultants excluded due to shuffle
            $table->timestamp('matched_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultation_requests');
    }
};


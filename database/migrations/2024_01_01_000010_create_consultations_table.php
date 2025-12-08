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
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultation_request_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('consultant_id')->constrained()->onDelete('cascade');
            $table->string('zoom_meeting_id')->nullable();
            $table->string('zoom_join_url')->nullable();
            $table->string('zoom_start_url')->nullable();
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'])->default('scheduled');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->integer('tokens_charged')->default(0);
            $table->decimal('token_rate_per_minute', 8, 2)->default(1.00);
            $table->text('notes')->nullable();
            $table->integer('user_rating')->nullable();
            $table->text('user_feedback')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('zoom_meeting_id');
            $table->index(['user_id', 'status']);
            $table->index(['consultant_id', 'status']);
        });

        // Add foreign key to token_transactions after consultations table exists
        Schema::table('token_transactions', function (Blueprint $table) {
            $table->foreign('consultation_id')->references('id')->on('consultations')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('token_transactions', function (Blueprint $table) {
            $table->dropForeign(['consultation_id']);
        });
        Schema::dropIfExists('consultations');
    }
};


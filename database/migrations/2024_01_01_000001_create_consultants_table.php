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
        Schema::create('consultants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->json('specializations')->nullable(); // Tech stack, areas of expertise
            $table->text('bio')->nullable();
            $table->json('languages')->nullable(); // Languages spoken
            $table->decimal('hourly_rate', 10, 2)->nullable();
            $table->enum('status', ['pending', 'approved', 'suspended'])->default('pending');
            $table->boolean('is_available')->default(false);
            $table->json('vetting_documents')->nullable(); // Uploaded certifications, etc.
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('is_available');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultants');
    }
};


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
        Schema::create('token_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['purchase', 'deduction', 'refund', 'bonus', 'adjustment']);
            $table->integer('amount'); // Positive for credits, negative for debits
            $table->integer('balance_after'); // Balance after transaction
            $table->string('description')->nullable();
            $table->string('stripe_payment_intent_id')->nullable();
            $table->foreignId('token_package_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('consultation_id')->nullable(); // Will be linked after consultation table
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('type');
            $table->index('stripe_payment_intent_id');
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('token_transactions');
    }
};


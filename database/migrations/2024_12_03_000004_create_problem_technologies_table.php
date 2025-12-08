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
        Schema::create('problem_technologies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('problem_submission_id')->constrained()->onDelete('cascade');
            $table->foreignId('technology_id')->nullable()->constrained()->onDelete('cascade');
            $table->boolean('is_custom')->default(false);
            $table->string('custom_name')->nullable(); // For unlisted technologies
            $table->timestamps();

            $table->index('problem_submission_id');
            $table->index('technology_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('problem_technologies');
    }
};


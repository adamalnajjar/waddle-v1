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
            $table->decimal('surge_multiplier', 3, 2)->default(1.00)->after('is_surge');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultant_invitations', function (Blueprint $table) {
            $table->dropColumn('surge_multiplier');
        });
    }
};


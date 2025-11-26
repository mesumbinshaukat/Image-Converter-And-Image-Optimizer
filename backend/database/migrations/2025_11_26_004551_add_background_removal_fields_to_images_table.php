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
        Schema::table('images', function (Blueprint $table) {
            $table->decimal('processing_time', 8, 2)->nullable()->after('operation');
            $table->boolean('success')->default(true)->after('processing_time');
            $table->text('error_message')->nullable()->after('success');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('images', function (Blueprint $table) {
            $table->dropColumn(['processing_time', 'success', 'error_message']);
        });
    }
};

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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('ip_address', 45);
            $table->string('action'); // login, logout, optimize, convert, error, etc.
            $table->string('entity_type')->nullable(); // Image, User, etc.
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->text('description')->nullable();
            $table->enum('level', ['info', 'warning', 'error'])->default('info');
            $table->text('error_message')->nullable();
            $table->text('stack_trace')->nullable();
            $table->json('metadata')->nullable(); // Additional context data
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('ip_address');
            $table->index('action');
            $table->index('level');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};

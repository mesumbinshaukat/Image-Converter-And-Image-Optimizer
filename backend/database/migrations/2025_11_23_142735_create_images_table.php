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
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('ip_address', 45); // Support IPv4 and IPv6
            $table->string('original_filename');
            $table->string('original_path');
            $table->string('processed_path')->nullable();
            $table->string('original_format', 10);
            $table->string('processed_format', 10)->nullable();
            $table->unsignedBigInteger('original_size'); // in bytes
            $table->unsignedBigInteger('processed_size')->nullable(); // in bytes
            $table->enum('operation', ['optimize', 'convert']); 
            $table->timestamp('expires_at'); // created_at + 24 hours
            $table->timestamps();
            
            $table->index('ip_address');
            $table->index('expires_at');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};

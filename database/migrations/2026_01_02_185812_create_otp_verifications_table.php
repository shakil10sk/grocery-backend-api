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
        Schema::create('otp_verifications', function (Blueprint $table) {
            $table->id();
            $table->string('identifier'); // email or phone
            $table->string('otp', 6);
            $table->enum('type', ['email', 'phone'])->default('phone');
            $table->enum('purpose', ['login', 'register', 'reset_password', 'verify_account'])->default('login');
            $table->boolean('is_verified')->default(false);
            $table->integer('attempts')->default(0);
            $table->timestamp('expires_at');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
            
            $table->index(['identifier', 'type', 'is_verified']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otp_verifications');
    }
};

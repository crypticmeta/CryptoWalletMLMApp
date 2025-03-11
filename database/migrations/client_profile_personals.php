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
        Schema::create('client_profile_personals', function (Blueprint $table) {
            $table->id();
            $table->string('client_id')->unique();
            $table->string('email_key')->nullable();
            $table->string('mobile_key')->nullable();
            $table->string('address')->nullable();
            $table->string('profile_image')->nullable();
            $table->boolean('is_status')->default(1);
            $table->boolean('is_live')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_profile_personals');
    }
};
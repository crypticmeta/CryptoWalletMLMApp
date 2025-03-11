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
        Schema::create('client_profile_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('client_id')->unique();
            $table->string('parent_id')->nullable();
            $table->string('client_intro_id')->nullable();
            $table->decimal('main_wallet', 18, 8)->default(0);
            $table->decimal('boosting_wallet', 18, 8)->default(0);
            $table->string('wallet_address')->nullable();
            $table->date('join_date')->nullable();
            $table->date('activation_date')->nullable();
            $table->timestamp('activation_time')->nullable();
            $table->date('boosting_date')->nullable();
            $table->timestamp('boosting_time')->nullable();
            $table->boolean('activation_status')->default(0);
            $table->integer('current_package')->default(0);
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
        Schema::dropIfExists('client_profile_accounts');
    }
};
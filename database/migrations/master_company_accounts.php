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
        Schema::create('master_company_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('wallet_address');
            $table->string('wallet_type')->nullable();
            $table->string('qr_code')->nullable();
            $table->boolean('is_active')->default(1);
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
        Schema::dropIfExists('master_company_accounts');
    }
};
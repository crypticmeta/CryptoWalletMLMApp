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
        Schema::create('client_payouts', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->string('income_type'); // boosting, etc.
            $table->decimal('total_commission', 18, 8);
            $table->boolean('pay_status')->default(0);
            $table->string('from_client_id')->nullable();
            $table->string('remarks')->nullable();
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
        Schema::dropIfExists('client_payouts');
    }
};
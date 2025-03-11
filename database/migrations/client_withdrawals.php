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
        Schema::create('client_withdrawals', function (Blueprint $table) {
            $table->id();
            $table->string('client_id');
            $table->decimal('withdrawal_amount', 18, 8);
            $table->decimal('amount', 18, 8); // Net amount after fees
            $table->string('txn_id')->nullable();
            $table->string('status')->default('Pending'); // Pending, Approved, Rejected
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
        Schema::dropIfExists('client_withdrawals');
    }
};
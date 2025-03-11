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
        Schema::create('client_investments', function (Blueprint $table) {
            $table->id();
            $table->string('client_id');
            $table->string('investment_type'); // e.g., 'boosting'
            $table->decimal('amount', 18, 8);
            $table->integer('package_id')->nullable();
            $table->string('txn_id')->nullable();
            $table->string('status')->default('Active');
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
        Schema::dropIfExists('client_investments');
    }
};
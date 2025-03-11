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
        Schema::create('master_commissions', function (Blueprint $table) {
            $table->id();
            $table->string('commission_type');
            $table->decimal('percentage', 8, 2);
            $table->text('description')->nullable();
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
        Schema::dropIfExists('master_commissions');
    }
};
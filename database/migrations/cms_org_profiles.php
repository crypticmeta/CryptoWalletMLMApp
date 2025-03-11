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
        // Create the new key-value table for organization profile
        Schema::create('cms_org_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('input_label');
            $table->text('input_text')->nullable();
            $table->boolean('is_status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cms_org_profiles');
    }
};
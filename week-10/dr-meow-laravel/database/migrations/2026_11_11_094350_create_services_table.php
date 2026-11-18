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
        Schema::create('services', function (Blueprint $table) {
            $table->string('id')->primary(); // contoh: 'hair-skin', 'complete'
            $table->string('name');
            $table->string('badge_label')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->integer('base_price')->default(0);
            $table->json('tier_prices')->nullable(); // menyimpan harga per berat badan
            $table->json('features')->nullable();    // menyimpan list fitur layanan
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};

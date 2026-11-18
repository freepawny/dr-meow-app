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
        Schema::create('cats', function (Blueprint $table) {
            $table->string('cat_id')->primary();
            $table->string('customer_id');
            $table->string('name');
            $table->float('weight')->default(0);
            $table->string('breeds');
            $table->float('vital_temperature')->nullable();
            $table->string('tempramen')->nullable();
            $table->text('medical_history')->nullable();
            $table->string('last_picture')->nullable();
            $table->timestamps();

            $table->foreign('customer_id')->references('customer_id')->on('customers')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cats');
    }
};

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
        Schema::table('services', function (Blueprint $table) {
            $table->string('category')->nullable();
            $table->unsignedInteger('duration_minutes')->nullable();
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->string('email')->nullable();
        });

        Schema::table('cats', function (Blueprint $table) {
            $table->decimal('age_years', 5, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cats', function (Blueprint $table) {
            $table->dropColumn('age_years');
        });
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('email');
        });
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['category', 'duration_minutes']);
        });
    }
};

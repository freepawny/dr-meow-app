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
        Schema::create('reservations', function (Blueprint $table) {
            $table->string('reservation_id')->primary(); 
            $table->string('service_id');
            $table->string('customer_id');
            $table->string('cat_id');
            $table->string('service_method');
            $table->string('work_status')->default('Pending');
            $table->boolean('notification_h1')->default(false);
            $table->integer('total_bill')->default(0);
            $table->string('paymen_status')->default('Unpaid');
            $table->json('before_after')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('service_id')->references('id')->on('services')->cascadeOnDelete();
            $table->foreign('customer_id')->references('customer_id')->on('customers')->cascadeOnDelete();
            $table->foreign('cat_id')->references('cat_id')->on('cats')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};

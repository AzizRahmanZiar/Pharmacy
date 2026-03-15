<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('medicines', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->integer('quantity')->default(0);
        $table->string('generic_name')->nullable();
        $table->string('company')->nullable();
        $table->string('family')->nullable();
        $table->decimal('buy_price',10,2)->default(0);
        $table->decimal('total_buyer_price',10,2)->default(0);
        $table->decimal('sale_price',10,2)->default(0);
        $table->date('expiry_date')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};

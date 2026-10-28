<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paee_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paee_id')->constrained('paees')->cascadeOnDelete();
            $table->text('description');
            $table->string('acquisition_type');
            $table->foreignId('assistive_technology_id')->nullable()->constrained('assistive_technologies')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paee_resources');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paee_objectives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paee_id')->constrained('paees')->cascadeOnDelete();
            $table->foreignId('linked_barrier_id')->nullable()->constrained('case_study_barriers')->nullOnDelete();
            $table->text('description');
            $table->string('term');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paee_objectives');
    }
};

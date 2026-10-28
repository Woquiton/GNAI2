<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_study_barriers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_study_id')->constrained('case_studies')->cascadeOnDelete();
            $table->string('type');
            $table->text('observed_situation');
            $table->text('participation_implication');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_study_barriers');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pei_discipline_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pei_discipline_id')->constrained('pei_disciplines')->cascadeOnDelete();
            $table->date('reviewed_at');
            $table->text('what_changed');
            $table->text('why');
            $table->foreignId('reviewer_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pei_discipline_revisions');
    }
};

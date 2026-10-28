<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('student_contexts');
    }

    /**
     * Reverse the migrations.
     *
     * Intentional, permanent removal of the "Contexto do Aluno" module — no rollback is provided.
     */
    public function down(): void
    {
        // Intentionally left empty: this removal is definitive.
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('student_contexts');
    }

    public function down(): void
    {
        // Remoção intencional e definitiva do módulo de Contexto Atual.
        // Não há rollback funcional: a tabela foi substituída pela cadeia Estudo de Caso -> PAEE -> PEI.
    }
};

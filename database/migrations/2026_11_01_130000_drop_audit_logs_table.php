<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

/** O histórico do sistema fica só em `audit_records`, inclusive o feed de atividades do painel. */
return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('audit_logs');
    }

    public function down(): void
    {
        // Tabela descontinuada: não há o que recriar.
    }
};

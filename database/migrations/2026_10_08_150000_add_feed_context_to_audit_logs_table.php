<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Estende a Auditoria existente para servir de fonte ao feed de
     * atividades: guarda o contexto já resolvido (nome do aluno, detalhe)
     * no momento do evento, para não exigir joins na hora de exibir, e o
     * student_id separado para permitir o filtro por vínculo (LGPD).
     */
    public function up(): void
    {
        Schema::table('audit_logs', function (Blueprint $table): void {
            // user_id e student_id já ganham índice automaticamente via FK
            // (constrained()); só created_at precisa de índice explícito aqui.
            $table->foreignId('student_id')->nullable()->after('auditable_id')->constrained('students')->nullOnDelete();
            $table->string('student_name')->nullable()->after('student_id');
            $table->string('detail')->nullable()->after('student_name');

            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::table('audit_logs', function (Blueprint $table): void {
            $table->dropIndex(['created_at']);
            $table->dropConstrainedForeignId('student_id');
            $table->dropColumn(['student_name', 'detail']);
        });
    }
};

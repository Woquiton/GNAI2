<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Recriação do módulo de auditoria (removido anteriormente), agora
     * escopado aos documentos sensíveis do AEE — Decreto 12.686/2025, art. 12
     * §5 e art. 14: registrar acesso e alteração de Estudo de Caso, PAEE e PEI.
     */
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action'); // viewed, created, updated
            $table->string('auditable_type');
            $table->unsignedBigInteger('auditable_id');
            $table->json('changes')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index(['auditable_type', 'auditable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Espelha o par já existente no Atendimento Pedagógico ("houve
     * participação de responsáveis?" + "responsáveis presentes"), agora por
     * aluno dentro do Atendimento AEE — é o que permite essa conversa entrar
     * como devolutiva à família no PEI.
     */
    public function up(): void
    {
        Schema::table('aee_student_evaluations', function (Blueprint $table): void {
            $table->boolean('with_guardians')->default(false)->after('is_present');
        });

        Schema::create('aee_student_evaluation_guardians', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('aee_student_evaluation_id')
                ->constrained('aee_student_evaluations', 'id', 'aee_eval_guardians_evaluation_fk')
                ->cascadeOnDelete();
            $table->foreignId('guardian_id')
                ->constrained('student_guardians', 'id', 'aee_eval_guardians_guardian_fk')
                ->restrictOnDelete();
            $table->timestamps();
            $table->unique(
                ['aee_student_evaluation_id', 'guardian_id'],
                'aee_eval_guardians_eval_guardian_unique',
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aee_student_evaluation_guardians');

        Schema::table('aee_student_evaluations', function (Blueprint $table): void {
            $table->dropColumn('with_guardians');
        });
    }
};

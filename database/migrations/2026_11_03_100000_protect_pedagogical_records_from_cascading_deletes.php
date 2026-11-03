<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Chaves que apagavam PEI, PAEE, estudo de caso e seus históricos quando o autor, o semestre, o curso,
     * a disciplina ou o professor eram excluídos. Passam a bloquear a exclusão; as Actions verificam os
     * vínculos antes e mostram uma mensagem clara.
     *
     * @var array<string, array<string, string>>
     */
    private const PROTECTED_KEYS = [
        'peis' => [
            'creator_id' => 'users',
            'semester_id' => 'semesters',
            'course_id' => 'courses',
            'paee_id' => 'paees',
        ],
        'pei_disciplines' => [
            'teacher_id' => 'teachers',
            'creator_id' => 'users',
            'discipline_id' => 'disciplines',
        ],
        'pei_discipline_revisions' => [
            'reviewer_id' => 'users',
        ],
        'paees' => [
            'case_study_id' => 'case_studies',
            'creator_id' => 'users',
            'semester_id' => 'semesters',
        ],
        'paee_reviews' => [
            'reviewer_id' => 'users',
        ],
        'case_studies' => [
            'creator_id' => 'users',
            'semester_id' => 'semesters',
        ],
        'case_study_contributions' => [
            'author_id' => 'users',
        ],
    ];

    public function up(): void
    {
        foreach (self::PROTECTED_KEYS as $tableName => $columns) {
            Schema::table($tableName, function (Blueprint $table) use ($columns): void {
                foreach ($columns as $column => $referencedTable) {
                    $table->dropForeign([$column]);
                    $table->foreign($column)->references('id')->on($referencedTable)->restrictOnDelete();
                }
            });
        }

        // Tabela da primeira versão do vínculo professor–disciplina, sem uso desde teacher_course_disciplines.
        Schema::dropIfExists('discipline_teacher');
    }

    public function down(): void
    {
        Schema::create('discipline_teacher', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->foreignId('discipline_id')->constrained()->cascadeOnDelete();
        });

        foreach (self::PROTECTED_KEYS as $tableName => $columns) {
            Schema::table($tableName, function (Blueprint $table) use ($columns): void {
                foreach ($columns as $column => $referencedTable) {
                    $table->dropForeign([$column]);
                    $table->foreign($column)->references('id')->on($referencedTable)->cascadeOnDelete();
                }
            });
        }
    }
};

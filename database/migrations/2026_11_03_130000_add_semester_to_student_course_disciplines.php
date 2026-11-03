<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Reprovação e risco de insucesso passam a ser registrados por semestre letivo. A reprovação ganha
     * `resolved_semester_id`: o semestre em que a dependência foi aprovada. Sem ele, a reprovação de um
     * semestre anterior continua como dependência pendente.
     *
     * Os registros existentes vão para o semestre da matrícula ou, sem ele, para o semestre atual ou o
     * mais recente.
     */
    public function up(): void
    {
        Schema::table('student_course_disciplines', function (Blueprint $table): void {
            $table->foreignId('semester_id')->nullable()->after('discipline_id');
            $table->foreignId('resolved_semester_id')->nullable()->after('category')
                ->constrained('semesters')->restrictOnDelete();
        });

        if (DB::table('student_course_disciplines')->exists()) {
            $fallbackSemesterId = DB::table('semesters')->where('is_current', true)->value('id')
                ?? DB::table('semesters')->orderByDesc('year')->orderByDesc('term')->value('id');

            DB::table('student_course_disciplines')
                ->orderBy('id')
                ->get(['id', 'student_course_id'])
                ->groupBy('student_course_id')
                ->each(function ($rows, $studentCourseId) use ($fallbackSemesterId): void {
                    $semesterId = DB::table('student_courses')->where('id', $studentCourseId)->value('semester_id')
                        ?? $fallbackSemesterId;

                    if ($semesterId === null) {
                        throw new RuntimeException('Cadastre um semestre antes de migrar as reprovações e os riscos dos alunos.');
                    }

                    DB::table('student_course_disciplines')
                        ->whereIn('id', $rows->pluck('id'))
                        ->update(['semester_id' => $semesterId]);
                });
        }

        // O índice novo começa por student_course_id e continua atendendo a chave estrangeira da matrícula.
        Schema::table('student_course_disciplines', function (Blueprint $table): void {
            $table->unique(
                ['student_course_id', 'semester_id', 'discipline_id', 'category'],
                'student_course_discipline_semester_unique',
            );
        });

        Schema::table('student_course_disciplines', function (Blueprint $table): void {
            $table->dropUnique('student_course_discipline_category_unique');
        });

        Schema::table('student_course_disciplines', function (Blueprint $table): void {
            $table->foreignId('semester_id')->nullable(false)->change();
            $table->foreign('semester_id')->references('id')->on('semesters')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        // Volta a um registro sem semestre: mantém só o mais recente de cada matrícula, disciplina e categoria.
        $keepIds = DB::table('student_course_disciplines')
            ->selectRaw('MAX(id) as id')
            ->groupBy('student_course_id', 'discipline_id', 'category')
            ->pluck('id');

        DB::table('student_course_disciplines')->whereNotIn('id', $keepIds)->delete();

        Schema::table('student_course_disciplines', function (Blueprint $table): void {
            $table->unique(
                ['student_course_id', 'discipline_id', 'category'],
                'student_course_discipline_category_unique',
            );
        });

        Schema::table('student_course_disciplines', function (Blueprint $table): void {
            $table->dropUnique('student_course_discipline_semester_unique');
            $table->dropForeign(['semester_id']);
            $table->dropForeign(['resolved_semester_id']);
            $table->dropColumn(['semester_id', 'resolved_semester_id']);
        });
    }
};

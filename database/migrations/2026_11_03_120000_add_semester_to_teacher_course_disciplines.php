<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * O vínculo do professor com a disciplina passa a valer por semestre letivo. Os vínculos existentes
     * ficam no semestre atual ou, sem semestre atual, no mais recente, e são repetidos nos semestres que
     * já têm PEI, para que os PEIs desses semestres continuem aceitando os mesmos professores.
     */
    public function up(): void
    {
        Schema::table('teacher_course_disciplines', function (Blueprint $table): void {
            $table->foreignId('semester_id')->nullable()->after('discipline_id');
        });

        $semesterId = null;

        if (DB::table('teacher_course_disciplines')->exists()) {
            $semesterId = DB::table('semesters')->where('is_current', true)->value('id')
                ?? DB::table('semesters')->orderByDesc('year')->orderByDesc('term')->value('id');

            if ($semesterId === null) {
                throw new RuntimeException('Cadastre um semestre antes de migrar os vínculos dos professores.');
            }

            DB::table('teacher_course_disciplines')->update(['semester_id' => $semesterId]);
        }

        // A unicidade passa a incluir o semestre. O índice novo começa por teacher_id e continua
        // atendendo a chave estrangeira do professor quando o antigo é removido.
        Schema::table('teacher_course_disciplines', function (Blueprint $table): void {
            $table->unique(
                ['teacher_id', 'course_id', 'discipline_id', 'semester_id'],
                'teacher_course_discipline_semester_unique',
            );
        });

        Schema::table('teacher_course_disciplines', function (Blueprint $table): void {
            $table->dropUnique('teacher_course_discipline_unique');
        });

        if ($semesterId !== null) {
            $this->replicateForPeiSemesters((int) $semesterId);
        }

        Schema::table('teacher_course_disciplines', function (Blueprint $table): void {
            $table->foreignId('semester_id')->nullable(false)->change();
            $table->foreign('semester_id')->references('id')->on('semesters')->restrictOnDelete();
        });
    }

    private function replicateForPeiSemesters(int $semesterId): void
    {
        $peiSemesterIds = DB::table('peis')
            ->where('semester_id', '!=', $semesterId)
            ->distinct()
            ->pluck('semester_id');
        $assignments = DB::table('teacher_course_disciplines')
            ->where('semester_id', $semesterId)
            ->get(['teacher_id', 'course_id', 'discipline_id']);
        $now = now();

        foreach ($peiSemesterIds as $peiSemesterId) {
            $rows = $assignments->map(fn (object $assignment): array => [
                'teacher_id' => $assignment->teacher_id,
                'course_id' => $assignment->course_id,
                'discipline_id' => $assignment->discipline_id,
                'semester_id' => $peiSemesterId,
                'created_at' => $now,
                'updated_at' => $now,
            ])->all();

            foreach (array_chunk($rows, 500) as $chunk) {
                DB::table('teacher_course_disciplines')->insert($chunk);
            }
        }
    }

    public function down(): void
    {
        // Volta a um vínculo sem semestre: mantém só o mais recente de cada professor, curso e disciplina.
        $keepIds = DB::table('teacher_course_disciplines')
            ->selectRaw('MAX(id) as id')
            ->groupBy('teacher_id', 'course_id', 'discipline_id')
            ->pluck('id');

        DB::table('teacher_course_disciplines')->whereNotIn('id', $keepIds)->delete();

        Schema::table('teacher_course_disciplines', function (Blueprint $table): void {
            $table->unique(['teacher_id', 'course_id', 'discipline_id'], 'teacher_course_discipline_unique');
        });

        Schema::table('teacher_course_disciplines', function (Blueprint $table): void {
            $table->dropUnique('teacher_course_discipline_semester_unique');
            $table->dropForeign(['semester_id']);
            $table->dropColumn('semester_id');
        });
    }
};

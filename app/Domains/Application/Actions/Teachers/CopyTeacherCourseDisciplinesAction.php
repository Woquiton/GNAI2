<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Teachers;

use App\Domains\Domain\Models\Semesters\Semester;
use App\Domains\Application\Queries\Teachers\PreviousAssignmentSemesterQuery;
use App\Domains\Domain\Exceptions\Teachers\InvalidTeacher;
use App\Domains\Domain\Models\Teachers\Teacher;
use App\Domains\Domain\Models\Teachers\TeacherCourseDiscipline;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Copia os vínculos professor–disciplina do semestre anterior para o semestre informado, de um
 * professor ou de todos. Os vínculos já existentes no semestre de destino são mantidos.
 */
final readonly class CopyTeacherCourseDisciplinesAction
{
    public function __construct(
        private PreviousAssignmentSemesterQuery $previousSemester,
    ) {}

    /**
     * @return array{created: int, source: Semester}
     *
     * @throws InvalidTeacher
     * @throws Throwable
     */
    public function execute(Semester $target, ?Teacher $teacher = null): array
    {
        return DB::transaction(function () use ($target, $teacher): array {
            $source = $this->previousSemester->execute(
                $target,
                $teacher instanceof Teacher ? (int) $teacher->getKey() : null,
            );

            if (! $source instanceof Semester) {
                throw new InvalidTeacher(
                    "Não há vínculos de professores em semestres anteriores a {$target->label} para copiar."
                );
            }

            $teachers = $teacher instanceof Teacher
                ? collect([$teacher])
                : Teacher::query()
                    ->whereIn(
                        'id',
                        TeacherCourseDiscipline::query()
                            ->where('semester_id', $source->getKey())
                            ->select('teacher_id'),
                    )
                    ->lockForUpdate()
                    ->get();

            $created = $teachers->sum(
                fn (Teacher $item): int => $item->copyCourseDisciplines($source, $target),
            );

            return ['created' => (int) $created, 'source' => $source];
        });
    }
}

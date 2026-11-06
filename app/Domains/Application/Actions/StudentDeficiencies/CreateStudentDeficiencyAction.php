<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\StudentDeficiencies;

use App\Domains\Domain\Exceptions\Deficiencies\InvalidDeficiency;
use App\Domains\Domain\Models\Deficiencies\Deficiency;
use App\Domains\Application\Data\StudentDeficiencies\CreateStudentDeficiencyData;
use App\Domains\Domain\DTOs\StudentDeficiencies\CreateStudentDeficiencyDTO;
use App\Domains\Domain\Exceptions\StudentDeficiencies\InvalidStudentDeficiency;
use App\Domains\Domain\Models\StudentDeficiencies\StudentDeficiency;
use App\Domains\Domain\Exceptions\Students\InvalidStudent;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreateStudentDeficiencyAction
{
    /**
     * @throws InvalidDeficiency
     * @throws InvalidStudent
     * @throws InvalidStudentDeficiency
     * @throws ModelNotFoundException
     * @throws Throwable
     */
    public function execute(Student $student, CreateStudentDeficiencyData $data): StudentDeficiency
    {
        return DB::transaction(function () use ($student, $data): StudentDeficiency {
            $lockedStudent = Student::query()
                ->lockForUpdate()
                ->findOrFail($student->getKey());
            $lockedStudent->ensureIsActive();

            $deficiency = Deficiency::query()
                ->findOrFail($data->deficiencyId);
            $deficiency->ensureIsActive();

            $studentAlreadyHasDeficiency = StudentDeficiency::query()
                ->where('student_id', $lockedStudent->getKey())
                ->where('deficiency_id', $deficiency->getKey())
                ->exists();

            if ($studentAlreadyHasDeficiency) {
                throw new InvalidStudentDeficiency('Este aluno já possui o perfil de atendimento selecionado.');
            }

            $studentDeficiencyDTO = new CreateStudentDeficiencyDTO(
                severity: $data->severity,
                notes: $data->notes,
            );

            $studentDeficiency = StudentDeficiency::register(
                student: $lockedStudent,
                deficiency: $deficiency,
                data: $studentDeficiencyDTO,
            );

            try {
                $studentDeficiency->save();
            } catch (UniqueConstraintViolationException $exception) {
                throw new InvalidStudentDeficiency(
                    'Este aluno já possui o perfil de atendimento selecionado. Recarregue a página e tente novamente.',
                    previous: $exception,
                );
            }

            return $studentDeficiency->load(['student.person', 'deficiency']);
        });
    }
}

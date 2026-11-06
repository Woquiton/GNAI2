<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\AeeRecords;

use App\Domains\Application\Data\AeeRecords\UpdateAeeStudentEvaluationData;
use App\Domains\Domain\DTOs\AeeRecords\AeeStudentEvaluationDTO;
use App\Domains\Domain\Exceptions\AeeRecords\InvalidAeeRecord;
use App\Domains\Domain\Models\AeeRecords\AeeStudentEvaluation;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Support\Facades\DB;
use Throwable;

final class UpdateAeeStudentEvaluationAction
{
    /** @throws Throwable */
    public function execute(Student $student, AeeStudentEvaluation $evaluation, UpdateAeeStudentEvaluationData $data, int $professionalId): AeeStudentEvaluation
    {
        return DB::transaction(function () use ($student, $evaluation, $data, $professionalId): AeeStudentEvaluation {
            $locked = AeeStudentEvaluation::query()->with('aeeRecord.attendanceSession')->lockForUpdate()->findOrFail($evaluation->getKey());
            if ((int) $locked->student_id !== (int) $student->getKey() || $data->studentId !== (int) $student->getKey()) {
                throw new InvalidAeeRecord('A avaliação informada não pertence a este aluno.');
            }
            if ((int) $locked->aeeRecord->attendanceSession->professional_id !== $professionalId) {
                throw new InvalidAeeRecord('Apenas o profissional vinculado ao agendamento pode editar esta avaliação.');
            }
            $locked->revise(new AeeStudentEvaluationDTO(
                studentId: $data->studentId,
                isPresent: $data->isPresent,
                withGuardians: $data->withGuardians,
                absenceReason: $data->absenceReason,
                adaptationsMade: $data->adaptationsMade,
                studentParticipation: $data->studentParticipation,
                developmentEvaluation: $data->developmentEvaluation,
                progressIndicators: $data->progressIndicators,
                recommendations: $data->recommendations,
                nextSessionAdjustments: $data->nextSessionAdjustments,
            ));
            $locked->save();
            $locked->syncGuardians($data->withGuardians ? $data->guardianIds : []);

            return $locked->load([
                'student.person',
                'aeeRecord.attendanceSession.professional.person',
            ]);
        });
    }
}

<?php

declare(strict_types=1);

namespace App\Application\Actions\AeeRecords;

use App\Application\Data\AeeRecords\UpdateAeeRecordData;
use App\Application\Services\Sessions\DirectAttendanceSessionRecorder;
use App\Domain\DTOs\AeeRecords\AeeStudentEvaluationDTO;
use App\Domain\DTOs\AeeRecords\UpdateAeeRecordDTO;
use App\Domain\Exceptions\InvalidAeeRecord;
use App\Domain\Models\AeeRecord;
use App\Domain\Models\AeeStudentEvaluation;
use App\Domain\Models\Session;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdateAeeRecordAction
{
    public function __construct(
        private DirectAttendanceSessionRecorder $sessions,
    ) {}

    /** @throws Throwable */
    public function execute(AeeRecord $aeeRecord, UpdateAeeRecordData $data, int $professionalId): AeeRecord
    {
        return DB::transaction(function () use ($aeeRecord, $data, $professionalId): AeeRecord {
            $record = AeeRecord::query()->with('studentEvaluations')->lockForUpdate()->findOrFail($aeeRecord->getKey());
            $session = Session::query()->with('students')->lockForUpdate()->findOrFail($record->attendance_session_id);
            $this->ensureCanManage($session, $professionalId, $data->evaluations);
            $this->sessions->correct($session, [
                'session_date' => $data->sessionDate,
                'start_time' => $data->startTime,
                'end_time' => $data->endTime,
                'location' => $data->location,
            ]);
            $dto = $this->dto($data);
            $record->revise($dto);
            $record->save();

            foreach ($data->evaluations as $index => $evaluationData) {
                $evaluationDTO = $dto->evaluations[$index];
                $evaluation = AeeStudentEvaluation::query()->where('aee_record_id', $record->getKey())->where('student_id', $evaluationDTO->studentId)->first();

                if ($evaluation === null) {
                    $student = $session->students()->where('students.id', $evaluationDTO->studentId)->lockForUpdate()->firstOrFail();
                    $student->ensureNotInIntake();
                    $evaluation = AeeStudentEvaluation::register($record, $student, $evaluationDTO);
                } else {
                    $evaluation->revise($evaluationDTO);
                }

                $evaluation->save();
                $guardianIds = array_map('intval', $evaluationData['guardian_ids'] ?? []);
                $evaluation->syncGuardians($evaluationDTO->withGuardians ? $guardianIds : []);
            }

            return $record->fresh([
                'attendanceSession.professional.person',
                'studentEvaluations.student.person',
            ]);
        });
    }

    private function ensureCanManage(Session $session, int $professionalId, array $evaluations): void
    {
        if ((int) $session->professional_id !== $professionalId) {
            throw new InvalidAeeRecord('Apenas o profissional vinculado ao agendamento pode editar o registro AEE.');
        }
        $expected = $session->students->pluck('id')->map(fn ($id): int => (int) $id)->sort()->values()->all();
        $received = collect($evaluations)->pluck('student_id')->map(fn ($id): int => (int) $id)->unique()->sort()->values()->all();
        if ($expected !== $received) {
            throw new InvalidAeeRecord('As avaliações devem corresponder exatamente aos alunos vinculados ao agendamento.');
        }
    }

    private function dto(UpdateAeeRecordData $data): UpdateAeeRecordDTO
    {
        return new UpdateAeeRecordDTO(
            duration: $data->duration,
            activitiesPerformed: $data->activitiesPerformed,
            strategiesUsed: $data->strategiesUsed,
            resourcesUsed: $data->resourcesUsed,
            generalObservations: $data->generalObservations,
            evaluations: collect($data->evaluations)
                ->map(fn (array $evaluation): AeeStudentEvaluationDTO => $this->evaluationDTO($evaluation))
                ->values()
                ->all(),
        );
    }

    private function evaluationDTO(array $data): AeeStudentEvaluationDTO
    {
        return new AeeStudentEvaluationDTO(
            studentId: (int) $data['student_id'],
            isPresent: (bool) $data['is_present'],
            withGuardians: (bool) ($data['with_guardians'] ?? false),
            absenceReason: $data['absence_reason'] ?? null,
            adaptationsMade: $data['adaptations_made'] ?? null,
            studentParticipation: $data['student_participation'] ?? null,
            developmentEvaluation: $data['development_evaluation'] ?? null,
            progressIndicators: $data['progress_indicators'] ?? null,
            recommendations: $data['recommendations'] ?? null,
            nextSessionAdjustments: $data['next_session_adjustments'] ?? null,
        );
    }
}

<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\AeeRecords;

use App\Domains\Inclusion\Domain\Enums\AttendanceType;
use App\Domains\Inclusion\Domain\Enums\SessionStatus;
use App\Domains\Inclusion\Domain\Exceptions\InvalidAeeRecord;
use App\Domains\Inclusion\Domain\Models\AeeRecord;
use App\Domains\Inclusion\Domain\Models\Guardian;
use App\Domains\Inclusion\Domain\Models\Session;
use App\Domains\Inclusion\Domain\Models\Student;

final class AeeRecordFormQuery
{
    public function forCreation(Session $session, int $professionalId): array
    {
        $session->load(['students.person', 'students.guardians.person', 'aeeRecord', 'pedagogicalRecord']);
        foreach ($session->students as $student) {
            $student->ensureNotInIntake();
        }
        if ((int) $session->professional_id !== $professionalId || ! AttendanceType::isAee($session->attendance_type) || ! SessionStatus::isScheduledValue($session->status) || ! $session->sessionDateHasArrived() || $session->aeeRecord !== null || $session->pedagogicalRecord !== null) {
            throw new InvalidAeeRecord('Este agendamento não está disponível para criação de registro AEE.');
        }

        return [
            'session' => $session,
            'guardiansByStudent' => $this->guardiansByStudent($session->students),
        ];
    }

    public function forUpdate(AeeRecord $aeeRecord, int $professionalId): array
    {
        $aeeRecord->load([
            'studentEvaluations.student.person',
            'studentEvaluations.guardians',
            'attendanceSession.students.person',
            'attendanceSession.students.guardians.person',
        ]);
        if ((int) $aeeRecord->attendanceSession->professional_id !== $professionalId) {
            throw new InvalidAeeRecord('Apenas o profissional vinculado pode editar este registro AEE.');
        }

        return [
            'aeeRecord' => $aeeRecord,
            'session' => $aeeRecord->attendanceSession,
            'guardiansByStudent' => $this->guardiansByStudent($aeeRecord->attendanceSession->students),
        ];
    }

    /**
     * Responsáveis que podem participar do atendimento, por aluno.
     *
     * @param  iterable<int, Student>  $students
     * @return array<int, list<array{id: int, name: string, relationship_label: string}>>
     */
    public function guardiansByStudent(iterable $students): array
    {
        $options = [];

        foreach ($students as $student) {
            $student->loadMissing('guardians.person');
            $options[(int) $student->getKey()] = $student->guardians
                ->sortBy('person.name')
                ->map(fn (Guardian $guardian): array => [
                    'id' => (int) $guardian->getKey(),
                    'name' => (string) $guardian->person?->name,
                    'relationship_label' => $guardian->relationshipLabel(),
                ])
                ->values()
                ->all();
        }

        return $options;
    }
}

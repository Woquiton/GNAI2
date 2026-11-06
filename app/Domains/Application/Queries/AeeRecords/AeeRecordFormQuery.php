<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\AeeRecords;

use App\Domains\Domain\Exceptions\AeeRecords\InvalidAeeRecord;
use App\Domains\Domain\Models\AeeRecords\AeeRecord;
use App\Domains\Application\Queries\Sessions\SessionFormQuery;
use App\Domains\Domain\Enums\Sessions\AttendanceType;
use App\Domains\Domain\Enums\Sessions\SessionStatus;
use App\Domains\Domain\Models\Sessions\Session;
use App\Domains\Domain\Models\Students\Student;

final readonly class AeeRecordFormQuery
{
    public function __construct(
        private SessionFormQuery $sessionForm,
    ) {}

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

    /** Registro direto, sem agendamento prévio: o profissional é o usuário logado. */
    public function forDirectCreation(int $professionalId): array
    {
        return $this->sessionForm->forDirectRecord(AttendanceType::AEE, $professionalId);
    }

    public function forUpdate(AeeRecord $aeeRecord, int $professionalId): array
    {
        $aeeRecord->load([
            'studentEvaluations.student.person',
            'studentEvaluations.guardians',
            'attendanceSession.students.person',
            'attendanceSession.students.guardians.person',
            'attendanceSession.professional.person',
        ]);
        if ((int) $aeeRecord->attendanceSession->professional_id !== $professionalId) {
            throw new InvalidAeeRecord('Apenas o profissional vinculado pode editar este registro AEE.');
        }

        return [
            'aeeRecord' => $aeeRecord,
            'session' => $aeeRecord->attendanceSession,
            'guardiansByStudent' => $this->guardiansByStudent($aeeRecord->attendanceSession->students),
        ] + $this->sessionForm->forAttendanceCorrection($aeeRecord->attendanceSession);
    }

    /**
     * Responsáveis que podem participar do atendimento, por aluno.
     *
     * @param  iterable<int, Student>  $students
     * @return array<int, list<array{id: int, name: string, relationship_label: string}>>
     */
    public function guardiansByStudent(iterable $students): array
    {
        return $this->sessionForm->guardiansByStudent($students);
    }
}

<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Sessions;

use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Domain\Models\Professionals\Professional;
use App\Domains\Domain\Enums\Sessions\AttendanceType;
use App\Domains\Domain\Enums\Sessions\SessionType;
use App\Domains\Domain\Models\Sessions\Session;
use App\Domains\Domain\Enums\Students\StudentStatus;
use App\Domains\Domain\Models\Students\Student;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

final class SessionFormQuery
{
    /**
     * @return array<string, mixed>
     */
    public function forCreation(): array
    {
        return $this->formOptions() + [
            'defaults' => [
                'attendance_type' => AttendanceType::AEE->value,
                'type' => SessionType::INDIVIDUAL->value,
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function forUpdate(Session $session): array
    {
        return $this->timeOptions() + $this->typeOptions() + [
            'session' => $session->load(['students.person', 'professional.person', 'aeeRecord', 'pedagogicalRecord']),
            'sessionForm' => [
                'attendance_type' => AttendanceType::valueOf($session->attendance_type),
                'session_date' => $session->session_date?->format('Y-m-d') ?? '',
                'start_time' => $session->start_time ? Carbon::parse($session->start_time)->format('H:i') : '',
                'end_time' => $session->end_time ? Carbon::parse($session->end_time)->format('H:i') : '',
            ],
        ];
    }

    /**
     * Cabeçalho do registro direto de um atendimento já realizado: horários, formatos, os alunos
     * que podem receber o tipo de atendimento e os responsáveis de cada um, para a participação.
     *
     * @return array<string, mixed>
     */
    public function forDirectRecord(AttendanceType $attendanceType, int $professionalId): array
    {
        $students = $this->students()
            ->filter(fn (Student $student): bool => $student->allowsAttendanceType($attendanceType))
            ->values()
            ->load('guardians.person');
        $guardiansByStudent = $this->guardiansByStudent($students);
        $students->each(fn (Student $student) => $student->unsetRelation('guardians'));

        return $this->timeOptions() + [
            'attendanceTypeLabel' => $attendanceType->label(),
            'sessionTypes' => SessionType::options(),
            'students' => $students,
            'guardiansByStudent' => $guardiansByStudent,
            'professional' => [
                'id' => $professionalId,
                'name' => Professional::with('person')->find($professionalId)?->person?->name,
            ],
        ];
    }

    /**
     * Data, horário e local corrigíveis na edição do registro do atendimento.
     *
     * @return array<string, mixed>
     */
    public function forAttendanceCorrection(Session $session): array
    {
        return $this->timeOptions() + [
            'attendanceTypeLabel' => AttendanceType::labelFor($session->attendance_type),
            'attendanceForm' => [
                'session_date' => $session->session_date?->format('Y-m-d') ?? '',
                'start_time' => $session->start_time ? Carbon::parse($session->start_time)->format('H:i') : '',
                'end_time' => $session->end_time ? Carbon::parse($session->end_time)->format('H:i') : '',
                'location' => (string) $session->location,
            ],
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

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return $this->timeOptions() + $this->typeOptions() + [
            'students' => $this->students(),
            'professionals' => $this->professionals(),
        ];
    }

    /**
     * @return array{attendanceTypes: array<string, string>, sessionTypes: array<string, string>}
     */
    private function typeOptions(): array
    {
        return [
            'attendanceTypes' => AttendanceType::options(),
            'sessionTypes' => SessionType::options(),
        ];
    }

    /**
     * @return array{startTimes: array<string, string>, endTimes: array<string, string>}
     */
    private function timeOptions(): array
    {
        $periods = [
            ['start' => '08:00', 'end' => '12:00'],
            ['start' => '14:00', 'end' => '17:00'],
        ];

        $startTimes = [];
        $endTimes = [];

        foreach ($periods as $period) {
            $current = Carbon::parse($period['start']);
            $end = Carbon::parse($period['end']);

            while ($current <= $end) {
                $time = $current->format('H:i');

                if ($time !== '12:00' && $time !== '17:00') {
                    $startTimes[$time] = $time;
                }

                if ($time !== '08:00' && $time !== '14:00') {
                    $endTimes[$time] = $time;
                }

                $current->addMinutes(30);
            }
        }

        return [
            'startTimes' => $startTimes,
            'endTimes' => $endTimes,
        ];
    }

    /**
     * @return Collection<int, Student>
     */
    private function students(): Collection
    {
        return Student::query()
            ->where('students.status', '!=', StudentStatus::INTAKE->value)
            ->with('person')
            ->join('people', 'people.id', '=', 'students.person_id')
            ->select('students.*')
            ->orderBy('people.name')
            ->get();
    }

    /**
     * @return Collection<int, Professional>
     */
    private function professionals(): Collection
    {
        return Professional::query()
            ->with('person')
            ->join('people', 'people.id', '=', 'professionals.person_id')
            ->select('professionals.*')
            ->orderBy('people.name')
            ->get();
    }
}

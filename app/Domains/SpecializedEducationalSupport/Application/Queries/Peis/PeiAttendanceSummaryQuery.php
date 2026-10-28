<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Queries\Peis;

use App\Domains\SpecializedEducationalSupport\Domain\Models\AeeStudentEvaluation;
use App\Domains\SpecializedEducationalSupport\Domain\Models\PedagogicalRecord;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Pei;
use Illuminate\Support\Collection;

/**
 * Portaria MEC 421/2026, art. 11, I/III/IV: o PEI reúne automaticamente os
 * registros de atendimento do aluno dentro do semestre do PEI — atividades,
 * acompanhamento/monitoramento e devolutivas às famílias — sem precisar de
 * telas ou listas próprias para isso.
 */
final class PeiAttendanceSummaryQuery
{
    /**
     * @return array{aee: Collection<int, AeeStudentEvaluation>, pedagogical: Collection<int, PedagogicalRecord>, returns: Collection<int, array<string, mixed>>}
     */
    public function execute(Pei $pei): array
    {
        $pei->loadMissing(['student', 'semester']);
        $semester = $pei->semester;
        $studentId = $pei->student_id;

        $aeeEvaluations = AeeStudentEvaluation::query()
            ->where('student_id', $studentId)
            ->whereHas('aeeRecord.attendanceSession', function ($query) use ($semester): void {
                $this->withinSemester($query, $semester);
            })
            ->with(['aeeRecord.attendanceSession.professional.person', 'guardians.person'])
            ->get()
            ->sortByDesc(fn (AeeStudentEvaluation $e) => $e->aeeRecord?->attendanceSession?->session_date)
            ->values();

        $pedagogicalRecords = PedagogicalRecord::query()
            ->whereHas('attendanceSession.students', function ($query) use ($studentId): void {
                $query->where('students.id', $studentId);
            })
            ->whereHas('attendanceSession', function ($query) use ($semester): void {
                $this->withinSemester($query, $semester);
            })
            ->with(['attendanceSession.professional.person', 'guardians.person'])
            ->get()
            ->sortByDesc(fn (PedagogicalRecord $r) => $r->attendanceSession?->session_date)
            ->values();

        $returns = $aeeEvaluations
            ->filter(fn (AeeStudentEvaluation $e) => $e->with_guardians)
            ->map(fn (AeeStudentEvaluation $e): array => [
                'date' => $e->aeeRecord?->attendanceSession?->session_date,
                'professional' => $e->aeeRecord?->attendanceSession?->professional?->person?->name,
                'guardians' => $e->guardians->pluck('person.name')->filter()->implode(', '),
                'summary' => $e->student_participation,
                'source' => 'Atendimento AEE',
            ])
            ->merge(
                $pedagogicalRecords
                    ->filter(fn (PedagogicalRecord $r) => $r->has_guardians)
                    ->map(fn (PedagogicalRecord $r): array => [
                        'date' => $r->attendanceSession?->session_date,
                        'professional' => $r->attendanceSession?->professional?->person?->name,
                        'guardians' => $r->guardian_names,
                        'summary' => $r->systematic_pedagogical_follow_up_record,
                        'source' => 'Atendimento Pedagógico',
                    ])
            )
            ->sortByDesc('date')
            ->values();

        return [
            'aee' => $aeeEvaluations,
            'pedagogical' => $pedagogicalRecords,
            'returns' => $returns,
        ];
    }

    private function withinSemester($query, $semester): void
    {
        if ($semester?->start_date !== null) {
            $query->whereDate('session_date', '>=', $semester->start_date);
        }

        if ($semester?->end_date !== null) {
            $query->whereDate('session_date', '<=', $semester->end_date);
        }
    }
}

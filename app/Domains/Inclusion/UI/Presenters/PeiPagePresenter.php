<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\UI\Presenters;

use App\Domains\Inclusion\Application\Data\Peis\ListPeisData;
use App\Domains\Inclusion\Domain\Enums\StudentStatus;
use App\Domains\Inclusion\Domain\Models\AeeStudentEvaluation;
use App\Domains\Inclusion\Domain\Models\Discipline;
use App\Domains\Inclusion\Domain\Models\Paee;
use App\Domains\Inclusion\Domain\Models\PedagogicalRecord;
use App\Domains\Inclusion\Domain\Models\Pei;
use App\Domains\Inclusion\Domain\Models\PeiDiscipline;
use App\Domains\Inclusion\Domain\Models\PeiDisciplineRevision;
use App\Domains\Inclusion\Domain\Models\Semester;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Shared\Domain\Support\AeeLabels;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

final class PeiPagePresenter
{
    /**
     * @param  LengthAwarePaginator<int, Pei>  $peis
     * @param  Collection<int, Student>  $students
     * @param  Collection<int, Semester>  $semesters
     * @return array<string, mixed>
     */
    public function all(
        LengthAwarePaginator $peis,
        Collection $students,
        Collection $semesters,
        ListPeisData $filters,
        Request $request,
    ): array {
        return [
            'peis' => $peis,
            'students' => $students
                ->map(static fn (Student $student): array => [
                    'value' => (string) $student->getKey(),
                    'label' => (string) ($student->person?->name ?? ''),
                ])
                ->values(),
            'semesters' => $this->semesterOptions($semesters),
            'filters' => $this->listFilterValues($filters) + [
                'student_id' => $filters->studentId === null ? '' : (string) $filters->studentId,
            ],
            'can' => $this->listPermissions($request),
        ];
    }

    /**
     * @param  LengthAwarePaginator<int, Pei>  $peis
     * @param  Collection<int, Semester>  $semesters
     * @param  Collection<int, Discipline>  $disciplines
     * @return array<string, mixed>
     */
    public function index(
        LengthAwarePaginator $peis,
        Student $student,
        Collection $semesters,
        Collection $disciplines,
        ListPeisData $filters,
        Request $request,
    ): array {
        return [
            'peis' => $peis,
            'student' => [
                'id' => $student->getKey(),
                'name' => (string) ($student->person?->name ?? ''),
            ],
            'semesters' => $this->semesterOptions($semesters),
            'disciplines' => $disciplines,
            'filters' => $this->listFilterValues($filters),
            'can' => $this->listPermissions($request),
        ];
    }

    /**
     * @param  array{aee: Collection<int, AeeStudentEvaluation>, pedagogical: Collection<int, PedagogicalRecord>, returns: Collection<int, array<string, mixed>>}  $attendanceSummary
     * @return array<string, mixed>
     */
    public function show(Pei $pei, Request $request, array $attendanceSummary): array
    {
        $user = $request->user();
        $userId = $user?->getKey() === null ? null : (int) $user->getKey();
        $canViewPaee = $user?->can('paee.view') ?? false;
        $canViewDisciplines = $user?->can('pei-discipline.view') ?? false;
        $canUpdateDiscipline = $user?->can('pei-discipline.update') ?? false;
        $canDeleteDiscipline = $user?->can('pei-discipline.delete') ?? false;
        $isCreator = $userId !== null && (int) $pei->creator_id === $userId;

        $pei->loadMissing([
            'student.person',
            'student.deficiencies',
            'course',
            'semester',
            'creator',
        ]);

        $student = $pei->student;
        $creator = $pei->creator;
        $tab = $request->string('tab')->toString();

        $disciplines = null;

        if ($canViewDisciplines) {
            $disciplines = $pei->peiDisciplines()
                ->with(['discipline', 'teacher.person'])
                ->latest()
                ->get()
                ->map(function (PeiDiscipline $item) use ($pei, $userId, $canUpdateDiscipline, $canDeleteDiscipline): array {
                    // A adaptação continua editável após finalizar o PEI; só a exclusão é bloqueada.
                    $isCreator = $userId !== null && (int) $item->creator_id === $userId;

                    return [
                        'id' => (int) $item->getKey(),
                        'discipline_name' => $item->discipline?->name,
                        'teacher_name' => $item->teacher?->person?->name,
                        'created_at' => $item->created_at?->toDateString(),
                        'can_update' => $isCreator && $canUpdateDiscipline,
                        'can_delete' => $isCreator && ! $pei->is_finished && $canDeleteDiscipline,
                    ];
                })
                ->values()
                ->all();
        }

        return [
            'pei' => [
                'id' => (int) $pei->getKey(),
                'version' => $pei->version,
                'is_finished' => (bool) $pei->is_finished,
                'created_at' => $pei->created_at?->toDateString(),
                'course_name' => $pei->course?->name,
                'semester_label' => $pei->semester?->label,
                'responsible' => $creator?->is_admin
                    ? 'admin'
                    : ($creator?->name ?: 'Sistema/Desconhecido'),
            ],
            'student' => [
                'id' => (int) $student->getKey(),
                'name' => (string) ($student->person?->name ?? ''),
                'registration' => $student->registration,
                'photo_url' => $student->person?->photo_url,
                'status_label' => $student->status?->label(),
                'status_color' => $student->status?->color(),
                'deficiencies' => $student->deficiencies
                    ->pluck('name')
                    ->filter()
                    ->values()
                    ->all(),
            ],
            'paee' => $canViewPaee ? $this->paee($pei) : null,
            'attendanceSummary' => $this->attendanceSummary($attendanceSummary),
            'otherRelevantInfo' => $pei->other_relevant_info,
            'peiDisciplines' => $disciplines,
            'activeTab' => $tab,
            'can' => [
                'viewPaee' => $canViewPaee,
                'viewDisciplines' => $canViewDisciplines,
                // As ações de domínio também exigem o criador do PEI e um PEI em aberto.
                'createDiscipline' => $pei->student->status !== StudentStatus::INTAKE && ! $pei->is_finished
                    && ($user?->can('pei-discipline.create') ?? false),
                'finish' => ! $pei->is_finished
                    && $isCreator
                    && ($user?->can('pei.update') ?? false),
                'delete' => $isCreator && ($user?->can('pei.delete') ?? false),
                'updateOtherInfo' => $user?->can('pei.update') ?? false,
                'pdf' => $user?->can('pei.view') ?? false,
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function discipline(Pei $pei, PeiDiscipline $peiDiscipline, Request $request): array
    {
        $user = $request->user();
        $userId = $user?->getKey() === null ? null : (int) $user->getKey();
        $isCreator = $userId !== null && (int) $peiDiscipline->creator_id === $userId;

        $pei->loadMissing('student.person');
        $peiDiscipline->loadMissing(['discipline', 'teacher.person', 'revisions.reviewer']);

        return [
            'pei' => [
                'id' => (int) $pei->getKey(),
                'version' => $pei->version,
                'is_finished' => (bool) $pei->is_finished,
            ],
            'student' => [
                'id' => (int) $pei->student->getKey(),
                'name' => (string) ($pei->student->person?->name ?? ''),
            ],
            'peiDiscipline' => [
                'id' => (int) $peiDiscipline->getKey(),
                'discipline_name' => $peiDiscipline->discipline?->name,
                'teacher_name' => $peiDiscipline->teacher?->person?->name,
                'specific_objectives_html' => $this->richText($peiDiscipline->specific_objectives),
                'objectives_deadline_html' => $this->richText($peiDiscipline->objectives_deadline, '—'),
                'content_programmatic_html' => $this->richText($peiDiscipline->content_programmatic),
                'curricular_reference_html' => $this->richText($peiDiscipline->curricular_reference, '—'),
                'methodologies_html' => $this->richText($peiDiscipline->methodologies),
                'materials_and_assistive_technology_html' => $this->richText($peiDiscipline->materials_and_assistive_technology, '—'),
                'evaluations_html' => $this->richText($peiDiscipline->evaluations),
                'complementary_records_html' => $this->richText(
                    $peiDiscipline->complementary_records,
                    'Nenhum registro complementar informado.',
                ),
                'opinion_html' => $this->richText($peiDiscipline->opinion),
            ],
            'revisions' => $peiDiscipline->revisions
                ->map(fn (PeiDisciplineRevision $revision): array => [
                    'id' => (int) $revision->getKey(),
                    'reviewed_at' => $revision->reviewed_at?->format('d/m/Y'),
                    'reviewer_name' => $revision->reviewer?->name,
                    'what_changed' => $revision->what_changed,
                    'why' => $revision->why,
                ])
                ->values()
                ->all(),
            'can' => [
                'update' => $isCreator && ($user?->can('pei-discipline.update') ?? false),
                'delete' => $isCreator && ! $pei->is_finished && ($user?->can('pei-discipline.delete') ?? false),
                'addRevision' => $pei->student->status !== StudentStatus::INTAKE && ($user?->can('pei-discipline.update') ?? false),
                'pdf' => $user?->can('pei.view') ?? false,
            ],
        ];
    }

    /**
     * Resumo do PAEE vinculado, no lugar do antigo contexto do estudante.
     *
     * @return array<string, mixed>|null
     */
    private function paee(Pei $pei): ?array
    {
        $pei->loadMissing('paee');
        $paee = $pei->paee;

        if (! $paee instanceof Paee) {
            return null;
        }

        return [
            'id' => (int) $paee->getKey(),
            'version' => $paee->version,
            'status_label' => AeeLabels::paeeStatus($paee->status),
            'attendance_frequency_per_week' => $paee->attendance_frequency_per_week,
            'attendance_duration_minutes' => $paee->attendance_duration_minutes,
            'attendance_format_label' => AeeLabels::attendanceFormat($paee->attendance_format),
            'attendance_location_label' => AeeLabels::attendanceLocation($paee->attendance_location),
            'common_teachers_articulation_html' => $this->richText($paee->common_teachers_articulation, '—'),
        ];
    }

    /**
     * Atividades, acompanhamento e devolutivas do semestre (Portaria 421/2026,
     * art. 11, I/III/IV), reunidos a partir dos atendimentos do aluno.
     *
     * @param  array{aee: Collection<int, AeeStudentEvaluation>, pedagogical: Collection<int, PedagogicalRecord>, returns: Collection<int, array<string, mixed>>}  $summary
     * @return array<string, list<array<string, mixed>>>
     */
    private function attendanceSummary(array $summary): array
    {
        $aeeDate = static fn (AeeStudentEvaluation $evaluation): ?string => $evaluation->aeeRecord?->attendanceSession?->session_date?->format('d/m/Y');

        $activities = $summary['aee']
            ->map(fn (AeeStudentEvaluation $evaluation): array => [
                'id' => 'aee-'.$evaluation->getKey(),
                'date' => $aeeDate($evaluation),
                'professional' => $evaluation->aeeRecord?->attendanceSession?->professional?->person?->name,
                'text_html' => $evaluation->is_present
                    ? $this->richText($evaluation->adaptations_made, '—')
                    : e('Aluno ausente: ').$this->richText($evaluation->absence_reason, '—'),
            ]);

        $monitoring = $summary['aee']
            ->filter(fn (AeeStudentEvaluation $evaluation): bool => (bool) $evaluation->is_present)
            ->map(fn (AeeStudentEvaluation $evaluation): array => [
                'id' => 'aee-'.$evaluation->getKey(),
                'date' => $aeeDate($evaluation),
                'source' => 'AEE',
                'text_html' => $this->richText($evaluation->development_evaluation, '—'),
                'indicators_html' => $evaluation->progress_indicators ? $this->richText($evaluation->progress_indicators) : null,
                'adjustments_html' => $evaluation->next_session_adjustments ? $this->richText($evaluation->next_session_adjustments) : null,
            ])
            ->concat($summary['pedagogical']->map(fn (PedagogicalRecord $record): array => [
                'id' => 'pedagogical-'.$record->getKey(),
                'date' => $record->attendanceSession?->session_date?->format('d/m/Y'),
                'source' => 'Pedagógico',
                'text_html' => $this->richText($record->systematic_pedagogical_follow_up_record, '—'),
                'indicators_html' => null,
                'adjustments_html' => null,
            ]));

        $returns = $summary['returns']->map(fn (array $return, int $index): array => [
            'id' => 'return-'.$index,
            'date' => $return['date']?->format('d/m/Y'),
            'source' => $return['source'],
            'professional' => $return['professional'],
            'guardians' => $return['guardians'] ?: null,
            'summary_html' => $this->richText($return['summary'], '—'),
        ]);

        return [
            'activities' => $activities->values()->all(),
            'monitoring' => $monitoring->values()->all(),
            'returns' => $returns->values()->all(),
        ];
    }

    /**
     * @return array{semester_id: string, version: string, is_finished: string}
     */
    private function listFilterValues(ListPeisData $filters): array
    {
        $isFinished = $filters->isFinished;

        return [
            'semester_id' => $filters->semesterId === null ? '' : (string) $filters->semesterId,
            'version' => $filters->version === null ? '' : (string) $filters->version,
            'is_finished' => $isFinished === null || $isFinished === ''
                ? ''
                : (string) (int) filter_var($isFinished, FILTER_VALIDATE_BOOLEAN),
        ];
    }

    /**
     * @param  Collection<int, Semester>  $semesters
     * @return list<array{value: string, label: string}>
     */
    private function semesterOptions(Collection $semesters): array
    {
        return $semesters
            ->map(static fn (Semester $semester): array => [
                'value' => (string) $semester->getKey(),
                'label' => (string) $semester->label,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array{create: bool, view: bool, delete: bool}
     */
    private function listPermissions(Request $request): array
    {
        $user = $request->user();

        return [
            'create' => $user?->can('pei.create') ?? false,
            'view' => $user?->can('pei.view') ?? false,
            'delete' => $user?->can('pei.delete') ?? false,
        ];
    }

    /** Texto simples mantém as quebras de linha; HTML é sanitizado como nas caixas do legado. */
    private function richText(?string $value, string $empty = '---'): string
    {
        $value = trim((string) $value);

        if ($value === '') {
            return e($empty);
        }

        if ($value === strip_tags($value)) {
            return nl2br(e($value), false);
        }

        return RichTextSanitizer::sanitize($value);
    }
}

<?php

declare(strict_types=1);

namespace App\Domains\UI\Presenters\Students;

use App\Domains\Domain\Models\AeeRecords\AeeStudentEvaluation;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\CaseStudies\CaseStudy;
use App\Domains\Domain\Models\Deficiencies\Deficiency;
use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Domain\Models\Paees\Paee;
use App\Domains\Domain\Models\PedagogicalRecords\PedagogicalRecord;
use App\Domains\Domain\Models\Peis\Pei;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\StudentCourses\StudentCourse;
use App\Domains\Domain\Enums\StudentDeficiencies\DeficiencySeverity;
use App\Domains\Domain\Models\StudentDocuments\StudentDocument;
use App\Domains\Domain\Enums\Students\StudentFollowUpType;
use App\Domains\Domain\Enums\Students\StudentStatus;
use App\Domains\Domain\Models\Students\Student;
use App\Shared\Domain\Support\AeeLabels;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

final class StudentPagePresenter
{
    public function shared(Request $request, ?Student $student = null): array
    {
        $abilities = [
            'student.view', 'student.create', 'student.update', 'student.delete',
            'support-request.view', 'support-request.create', 'support-request.update', 'support-request.delete',
            'student-course.view', 'student-course.create', 'student-course.update', 'student-course.delete',
            'student-deficiency.view', 'student-deficiency.create', 'student-deficiency.update', 'student-deficiency.delete',
            'guardian.view', 'guardian.create', 'guardian.update', 'guardian.delete',
            'case-study.view', 'case-study.create', 'case-study.update', 'paee.view', 'paee.create',
            'pei.view', 'pei.create', 'pei.update', 'pei.delete',
            'student-document.view', 'student-document.create', 'student-document.update', 'student-document.delete',
            'aee-record.view', 'aee-record.view-all', 'aee-record.view-own', 'aee-record.update', 'aee-record.delete',
            'pedagogical-record.view', 'pedagogical-record.view-all', 'pedagogical-record.view-own',
            'pedagogical-record.update', 'pedagogical-record.delete',
            'loan.index', 'loan.show', 'loan.create',
        ];

        return [
            'followUpTypes' => collect(StudentFollowUpType::cases())->mapWithKeys(
                fn (StudentFollowUpType $type): array => [$type->value => $type->label()],
            )->all(),
            'permissions' => collect($abilities)->mapWithKeys(
                fn (string $ability): array => [
                    $ability => ($request->user()?->can($ability) ?? false)
                        && ! ($student?->status === StudentStatus::INTAKE
                            && str_ends_with($ability, '.create')
                            && ! in_array($ability, ['student.create', 'support-request.create'], true)),
                ],
            )->all(),
            'studentStatuses' => collect(StudentStatus::cases())->mapWithKeys(
                fn (StudentStatus $status): array => [$status->value => $status->label()],
            )->all(),
            'statusColors' => collect(StudentStatus::cases())->mapWithKeys(
                fn (StudentStatus $status): array => [$status->value => $status->color()],
            )->all(),
        ];
    }

    public function student(Student $student, Request $request): array
    {
        $data = $student->toArray();
        $data['person'] = $this->person($student->person);
        $data['entry_date'] = $student->entry_date?->toDateString();

        // Seções que a tela legada ocultava por @can não são serializadas.
        foreach ([
            'guardians' => 'guardian.view',
            'documents' => 'student-document.view',
            'current_case_study' => 'case-study.view',
            'current_paee' => 'paee.view',
            'deficiencies' => 'student-deficiency.view',
            'peis' => 'pei.view',
        ] as $key => $ability) {
            if (! $request->user()?->can($ability)) {
                unset($data[$key]);
            }
        }

        if (isset($data['guardians'])) {
            $data['guardians'] = $this->guardians($student->guardians);
        }
        if (isset($data['documents'])) {
            $data['documents'] = $this->documents($student->documents);
        }
        if (isset($data['student_courses'])) {
            $data['student_courses'] = $this->studentCourses($student->studentCourses);
        }
        if (isset($data['deficiencies'])) {
            $data['deficiencies'] = $this->deficiencies($student->deficiencies);
        }
        if (isset($data['peis'])) {
            $data['peis'] = $this->peis($student->peis);
        }

        return $data;
    }

    /** @param Collection<int, StudentCourse> $studentCourses */
    public function studentCourses(Collection $studentCourses): array
    {
        return $studentCourses->map(fn (StudentCourse $studentCourse): array => [
            ...$studentCourse->toArray(),
            'semester_label' => $studentCourse->semester?->label,
        ])->all();
    }

    /** @param Collection<int, Deficiency> $deficiencies */
    public function deficiencies(Collection $deficiencies): array
    {
        return $deficiencies->map(fn (Deficiency $deficiency): array => [
            ...$deficiency->toArray(),
            'student_deficiency_id' => (int) $deficiency->pivot->getKey(),
            'severity_label' => DeficiencySeverity::tryFrom($deficiency->pivot->severity ?? '')?->label(),
            'severity_color' => DeficiencySeverity::tryFrom($deficiency->pivot->severity ?? '')?->color(),
        ])->all();
    }

    /** @param Collection<int, Guardian> $guardians */
    public function guardians(Collection $guardians): array
    {
        return $guardians->map(fn (Guardian $guardian): array => [
            ...$guardian->toArray(),
            'person' => $this->person($guardian->person),
            'relationship_label' => $guardian->relationshipLabel(),
        ])->all();
    }

    /** @param Collection<int, Pei> $peis */
    public function peis(Collection $peis): array
    {
        return $peis->map(fn (Pei $pei): array => [
            ...$pei->toArray(),
            'semester_label' => $pei->semester?->label,
            'teacher_names' => $pei->peiDisciplines->pluck('teacher.person.name')->filter()->unique()->values()->all(),
        ])->all();
    }

    /** @param Collection<int, StudentDocument> $documents */
    public function documents(Collection $documents): array
    {
        return $documents->map(fn (StudentDocument $document): array => [
            ...$document->toArray(),
            'type_label' => $document->type->label(),
            'semester_label' => $document->semester?->label,
        ])->all();
    }

    /**
     * Todas as versões do Estudo de Caso exibidas no prontuário.
     *
     * @param  Collection<int, CaseStudy>  $caseStudies
     * @return list<array<string, mixed>>
     */
    public function caseStudies(Collection $caseStudies): array
    {
        return $caseStudies->map(fn (CaseStudy $caseStudy): array => [
            'id' => (int) $caseStudy->getKey(),
            'version' => $caseStudy->version,
            'semester_label' => $caseStudy->semester?->label,
            'status' => $caseStudy->status,
            'status_label' => AeeLabels::caseStudyStatus($caseStudy->status),
            'created_at' => $caseStudy->created_at?->toDateString(),
        ])->values()->all();
    }

    /**
     * Todas as versões do PAEE exibidas no prontuário.
     *
     * @param  Collection<int, Paee>  $paees
     * @return list<array<string, mixed>>
     */
    public function paees(Collection $paees): array
    {
        return $paees->map(fn (Paee $paee): array => [
            'id' => (int) $paee->getKey(),
            'version' => $paee->version,
            'is_current' => (bool) $paee->is_current,
            'semester_label' => $paee->semester?->label,
            'status' => $paee->status,
            'status_label' => AeeLabels::paeeStatus($paee->status),
            'next_review_date' => $paee->next_review_date?->toDateString(),
        ])->values()->all();
    }

    /**
     * Status do atendimento, ordenado pelas dependências reais dos fluxos de
     * curso, laudo, Estudo de Caso, PAEE e PEI.
     *
     * @return array{items: list<array<string, mixed>>, alerts: list<string>}
     */
    public function statusPanel(
        Student $student,
        bool $hasLaudo,
        ?int $currentCourseId,
        bool $hasCurrentSemester,
        Request $request,
        bool $hasSupportRequest = false,
    ): array {
        $studentId = (int) $student->getKey();
        $isEnabled = $student->status->isEnabled();
        $hasCurrentCourse = $currentCourseId !== null;
        $caseStudy = $student->currentCaseStudy;
        $paee = $student->currentPaee;
        $currentPei = $student->peis()
            ->where('is_current', true)
            ->first(['id', 'updated_at']);
        $hasCurrentPei = $currentPei instanceof Pei;
        $caseStudyCompleted = $caseStudy instanceof CaseStudy && $caseStudy->status === CaseStudy::STATUS_COMPLETED;
        $canStartPaee = $caseStudy instanceof CaseStudy
            && ($caseStudyCompleted || $hasLaudo)
            && $hasCurrentSemester;
        $canStartPei = $isEnabled
            && $hasCurrentCourse
            && $paee instanceof Paee
            && $hasCurrentSemester;

        $items = [];
        if ($request->user()?->can('support-request.view')) {
            $items[] = [
                'key' => 'support-request',
                'label' => 'Solicitação de atendimento',
                'ok' => $hasSupportRequest,
                'optional' => true,
                'status' => $hasSupportRequest ? 'Registrada' : 'Não registrada',
                'icon' => 'ti-receipt',
                'href' => route('specialized-educational-support.students.show', ['student' => $studentId, 'tab' => 'support-requests']),
                'action_label' => 'Ver',
                'updated_at' => null,
            ];
        }
        $alerts = [];

        if ($paee instanceof Paee && $paee->next_review_date !== null && $paee->next_review_date->isPast()) {
            $alerts[] = 'O PAEE está com a revisão vencida desde '.$paee->next_review_date->format('d/m/Y').'.';
        }

        if ($paee instanceof Paee && ! $caseStudyCompleted && ! $hasLaudo) {
            $alerts[] = 'O PAEE ativo não está vinculado a um Estudo de Caso concluído.';
        }

        $items[] = [
            'key' => 'current-course',
            'label' => 'Vínculo com curso',
            'ok' => $hasCurrentCourse,
            'status' => $hasCurrentCourse ? 'Vigente' : 'Não cadastrado',
            'icon' => 'fa fa-graduation-cap',
            'href' => $hasCurrentCourse && $request->user()?->can('student-course.view')
                ? route('specialized-educational-support.student-courses.show', $currentCourseId)
                : (! $hasCurrentCourse && $isEnabled && $request->user()?->can('student-course.create')
                    ? route('specialized-educational-support.student-courses.create', $studentId)
                    : null),
            'action_label' => $hasCurrentCourse ? 'Ver' : 'Iniciar',
            'updated_at' => null,
        ];

        $items[] = [
            'key' => 'technical-report',
            'label' => 'Laudo',
            'ok' => $hasLaudo,
            'status' => $hasLaudo ? 'Anexado' : 'Não anexado',
            'icon' => 'fa fa-file-text-o',
            'href' => $hasLaudo && $request->user()?->can('student-document.view')
                ? route('specialized-educational-support.students.show', [
                    'student' => $studentId,
                    'tab' => 'documents',
                ])
                : (! $hasLaudo && $isEnabled && $hasCurrentSemester && $request->user()?->can('student-document.create')
                    ? route('specialized-educational-support.student-documents.create', $studentId)
                    : null),
            'action_label' => $hasLaudo ? 'Ver' : 'Iniciar',
            'updated_at' => null,
        ];

        $caseStudyInProgress = $caseStudy instanceof CaseStudy && ! $caseStudyCompleted;
        $caseStudyAction = match (true) {
            $caseStudyCompleted => 'Ver',
            $caseStudyInProgress && $request->user()?->can('case-study.update') => 'Continuar',
            $caseStudyInProgress => 'Ver',
            default => 'Iniciar',
        };
        $items[] = [
            'key' => 'case-study',
            'label' => 'Estudo de Caso',
            'ok' => $caseStudyCompleted,
            'status' => $caseStudyCompleted ? 'Concluído' : ($caseStudyInProgress ? 'Em andamento' : 'Não iniciado'),
            'icon' => 'fa fa-stethoscope',
            'href' => $caseStudy instanceof CaseStudy && $request->user()?->can('case-study.view')
                ? route('specialized-educational-support.case-study.show', $caseStudy)
                : (! ($caseStudy instanceof CaseStudy) && $isEnabled && $hasCurrentSemester && $request->user()?->can('case-study.create')
                    ? route('specialized-educational-support.case-study.create', $studentId)
                    : null),
            'action_label' => $caseStudyAction,
            'updated_at' => $caseStudy?->updated_at?->format('d/m/Y'),
        ];

        $items[] = [
            'key' => 'paee',
            'label' => 'PAEE',
            'ok' => $paee instanceof Paee,
            'status' => $paee instanceof Paee ? 'Ativo' : 'Não iniciado',
            'icon' => 'fa fa-sitemap',
            'href' => $paee instanceof Paee && $request->user()?->can('paee.view')
                ? route('specialized-educational-support.paee.show', $paee)
                : (! ($paee instanceof Paee) && $isEnabled && $canStartPaee && $request->user()?->can('paee.create')
                    ? route('specialized-educational-support.paee.create', $caseStudy)
                    : null),
            'action_label' => $paee instanceof Paee ? 'Ver' : 'Iniciar',
            'updated_at' => $paee?->updated_at?->format('d/m/Y'),
        ];

        $items[] = [
            'key' => 'pei',
            'label' => 'PEI',
            'ok' => $hasCurrentPei,
            'status' => $hasCurrentPei ? 'Ativo' : 'Não iniciado',
            'icon' => 'fa fa-file',
            'href' => $hasCurrentPei && $request->user()?->can('pei.view')
                ? route('specialized-educational-support.pei.show', $currentPei)
                : (! $hasCurrentPei && $canStartPei && $request->user()?->can('pei.create')
                    ? route('specialized-educational-support.pei.create', $studentId)
                    : null),
            'action_label' => $hasCurrentPei ? 'Ver' : 'Iniciar',
            'updated_at' => $currentPei?->updated_at?->format('d/m/Y'),
        ];

        return [
            'items' => $items,
            'alerts' => $alerts,
        ];
    }

    /** @param Collection<int, AeeStudentEvaluation> $evaluations */
    public function markManageableAeeEvaluations(Collection $evaluations, ?User $user): void
    {
        $professionalId = $user?->professional_id;

        $evaluations->each(static function (AeeStudentEvaluation $evaluation) use ($professionalId): void {
            $session = $evaluation->aeeRecord?->attendanceSession;
            $evaluation->setAttribute(
                'can_manage',
                $professionalId !== null
                    && (int) $session?->professional_id === (int) $professionalId,
            );
        });
    }

    /** @param Collection<int, PedagogicalRecord> $records */
    public function markManageablePedagogicalRecords(Collection $records, ?User $user): void
    {
        $professionalId = $user?->professional_id;

        $records->each(static function (PedagogicalRecord $record) use ($professionalId): void {
            $record->setAttribute(
                'can_manage',
                $professionalId !== null
                    && (int) $record->attendanceSession?->professional_id === (int) $professionalId,
            );
        });
    }

    private function person(Person $person): array
    {
        return [
            ...$person->toArray(),
            'photo_url' => $person->photo_url,
            'gender_label' => $person->gender_label,
            'birth_date' => $person->birth_date?->toDateString(),
            'age' => $person->birth_date?->age,
            'address_html' => RichTextSanitizer::sanitize($person->address ?? '', decodeEntities: false),
        ];
    }
}

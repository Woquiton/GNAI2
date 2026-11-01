<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\UI\Presenters;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\Inclusion\Domain\Enums\DeficiencySeverity;
use App\Domains\Inclusion\Domain\Enums\StudentStatus;
use App\Domains\Inclusion\Domain\Models\AeeStudentEvaluation;
use App\Domains\Inclusion\Domain\Models\CaseStudy;
use App\Domains\Inclusion\Domain\Models\Paee;
use App\Domains\Inclusion\Domain\Models\PedagogicalRecord;
use App\Domains\Inclusion\Domain\Models\Person;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Shared\Domain\Support\AeeLabels;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

final class StudentPagePresenter
{
    public function shared(Request $request): array
    {
        $abilities = [
            'student.view', 'student.create', 'student.update', 'student.delete',
            'student-course.view', 'student-course.create', 'student-course.update', 'student-course.delete',
            'student-deficiency.view', 'student-deficiency.create', 'student-deficiency.update', 'student-deficiency.delete',
            'guardian.view', 'guardian.create', 'guardian.update', 'guardian.delete',
            'case-study.view', 'case-study.create', 'paee.view', 'paee.create',
            'pei.view', 'pei.create', 'pei.update', 'pei.delete',
            'student-document.view', 'student-document.create', 'student-document.update', 'student-document.delete',
            'aee-record.view', 'aee-record.view-all', 'aee-record.view-own', 'aee-record.update', 'aee-record.delete',
            'pedagogical-record.view', 'pedagogical-record.view-all', 'pedagogical-record.view-own',
            'pedagogical-record.update', 'pedagogical-record.delete',
        ];

        return [
            'permissions' => collect($abilities)->mapWithKeys(
                fn (string $ability): array => [$ability => $request->user()?->can($ability) ?? false],
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
            $data['guardians'] = $student->guardians->map(fn ($guardian): array => [
                ...$guardian->toArray(),
                'person' => $this->person($guardian->person),
                'relationship_label' => $guardian->relationshipLabel(),
            ])->all();
        }
        if (isset($data['documents'])) {
            $data['documents'] = $student->documents->map(fn ($document): array => [
                ...$document->toArray(),
                'type_label' => $document->type->label(),
                'semester_label' => $document->semester?->label,
            ])->all();
        }
        if (isset($data['student_courses'])) {
            $data['student_courses'] = $student->studentCourses->map(fn ($studentCourse): array => [
                ...$studentCourse->toArray(),
                'semester_label' => $studentCourse->semester?->label,
            ])->all();
        }
        if (isset($data['deficiencies'])) {
            $data['deficiencies'] = $student->deficiencies->map(fn ($deficiency): array => [
                ...$deficiency->toArray(),
                'student_deficiency_id' => (int) $deficiency->pivot->getKey(),
                'severity_label' => DeficiencySeverity::tryFrom($deficiency->pivot->severity ?? '')?->label(),
                'severity_color' => DeficiencySeverity::tryFrom($deficiency->pivot->severity ?? '')?->color(),
            ])->all();
        }
        if (isset($data['peis'])) {
            $data['peis'] = $student->peis->map(fn ($pei): array => [
                ...$pei->toArray(),
                'semester_label' => $pei->semester?->label,
                'teacher_names' => $pei->peiDisciplines->pluck('teacher.person.name')->filter()->unique()->values()->all(),
            ])->all();
        }

        return $data;
    }

    /**
     * Últimas versões do Estudo de Caso exibidas no prontuário.
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
     * Últimas versões do PAEE exibidas no prontuário.
     *
     * @param  Collection<int, Paee>  $paees
     * @return list<array<string, mixed>>
     */
    public function paees(Collection $paees): array
    {
        return $paees->map(fn (Paee $paee): array => [
            'id' => (int) $paee->getKey(),
            'version' => $paee->version,
            'semester_label' => $paee->semester?->label,
            'status' => $paee->status,
            'status_label' => AeeLabels::paeeStatus($paee->status),
            'next_review_date' => $paee->next_review_date?->toDateString(),
        ])->values()->all();
    }

    /**
     * Painel "Status do atendimento": laudo, Estudo de Caso, PAEE e PEI
     * vigentes, com os alertas de revisão e de vínculo do PAEE.
     *
     * @return array{boxes: list<array<string, mixed>>, alerts: list<string>}
     */
    public function statusPanel(Student $student, bool $hasLaudo): array
    {
        $base = '/inclusao';
        $caseStudy = $student->currentCaseStudy;
        $paee = $student->currentPaee;
        $pei = $student->peis()->where('is_current', true)->first();
        $caseStudyCompleted = $caseStudy instanceof CaseStudy && $caseStudy->status === CaseStudy::STATUS_COMPLETED;

        $alerts = [];

        if ($paee instanceof Paee && $paee->next_review_date !== null && $paee->next_review_date->isPast()) {
            $alerts[] = 'O PAEE está com a revisão vencida desde '.$paee->next_review_date->format('d/m/Y').'.';
        }

        if ($paee instanceof Paee && ! $caseStudyCompleted) {
            $alerts[] = 'O PAEE ativo não está vinculado a um Estudo de Caso concluído.';
        }

        return [
            'boxes' => [
                [
                    'key' => 'laudo',
                    'label' => 'Laudo',
                    'ok' => $hasLaudo,
                    'status' => $hasLaudo ? 'Anexado' : 'Não anexado',
                    'icon' => 'fa fa-file-text-o',
                    'href' => null,
                    'tab' => 'documents',
                    'updated_at' => null,
                ],
                [
                    'key' => 'case-study',
                    'label' => 'Estudo de Caso',
                    'ok' => $caseStudyCompleted,
                    'status' => $caseStudyCompleted ? 'Concluído' : ($caseStudy ? 'Em andamento' : 'Não iniciado'),
                    'icon' => 'fa fa-stethoscope',
                    'href' => $caseStudy
                        ? "{$base}/estudos-de-caso/{$caseStudy->getKey()}/visualizar"
                        : "{$base}/estudos-de-caso/{$student->getKey()}/criar",
                    'tab' => null,
                    'updated_at' => $caseStudy?->updated_at?->format('d/m/Y'),
                ],
                [
                    'key' => 'paee',
                    'label' => 'PAEE',
                    'ok' => $paee instanceof Paee,
                    'status' => $paee ? 'Ativo' : 'Não iniciado',
                    'icon' => 'fa fa-sitemap',
                    'href' => $paee ? "{$base}/paees/{$paee->getKey()}/visualizar" : null,
                    'tab' => null,
                    'updated_at' => $paee?->updated_at?->format('d/m/Y'),
                ],
                [
                    'key' => 'pei',
                    'label' => 'PEI',
                    'ok' => $pei !== null,
                    'status' => $pei ? 'Ativo' : 'Não iniciado',
                    'icon' => 'fa fa-file',
                    'href' => $pei ? "{$base}/peis/{$pei->getKey()}/visualizar" : null,
                    'tab' => null,
                    'updated_at' => $pei?->updated_at?->format('d/m/Y'),
                ],
            ],
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

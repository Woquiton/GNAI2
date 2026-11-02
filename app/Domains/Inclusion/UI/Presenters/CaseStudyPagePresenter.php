<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\UI\Presenters;

use App\Domains\Inclusion\Application\Data\CaseStudies\ListCaseStudiesData;
use App\Domains\Inclusion\Application\Queries\CaseStudies\CaseStudyBarrierOptionsQuery;
use App\Domains\Inclusion\Domain\Models\CaseStudy;
use App\Domains\Inclusion\Domain\Models\CaseStudyBarrier;
use App\Domains\Inclusion\Domain\Models\CaseStudyContribution;
use App\Domains\Inclusion\Domain\Models\CaseStudyStrategy;
use App\Domains\Inclusion\Domain\Models\Semester;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Shared\Domain\Support\AeeLabels;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

/**
 * Props Inertia das telas de Estudo de Caso (listagens, formulário e detalhes),
 * com rótulos e permissões já resolvidos no servidor.
 */
final class CaseStudyPagePresenter
{
    public function __construct(private readonly CaseStudyBarrierOptionsQuery $barrierOptions) {}

    /** Opções do formulário, nos mesmos rótulos do formulário Blade do módulo. */
    private const DEMAND_ORIGINS = [
        'teacher' => 'Professor',
        'family' => 'Família',
        'student' => 'Estudante',
        'medical_report' => 'Laudo médico',
        'other' => 'Outro',
    ];

    private const NEEDED_SUPPORTS = [
        'locomotion' => 'Locomoção',
        'hygiene' => 'Higiene',
        'feeding' => 'Alimentação',
        'communication' => 'Comunicação',
        'interaction' => 'Interação',
        'assistive_technology' => 'Tecnologia assistiva',
        'libras' => 'Libras',
        'guide_interpreter' => 'Guia-intérprete',
        'orientation_mobility' => 'Orientação e mobilidade',
        'none' => 'Nenhum',
    ];

    private const ACCEPTANCE_STATUSES = [
        'accepted' => 'Aceito',
        'declined' => 'Recusado',
        'not_applicable' => 'Não aplicável',
    ];

    private const STATUSES = [
        CaseStudy::STATUS_DRAFT => 'Rascunho',
        CaseStudy::STATUS_IN_PROGRESS => 'Em andamento',
        CaseStudy::STATUS_COMPLETED => 'Concluído',
    ];

    /**
     * @param  LengthAwarePaginator<int, CaseStudy>  $caseStudies
     * @param  Collection<int, Semester>  $semesters
     * @return array<string, mixed>
     */
    public function list(
        LengthAwarePaginator $caseStudies,
        Collection $semesters,
        ListCaseStudiesData $filters,
        Request $request,
        ?Student $student = null,
    ): array {
        $caseStudies->through(fn (CaseStudy $caseStudy): array => $this->row($caseStudy));

        return [
            'caseStudies' => $caseStudies,
            'student' => $student === null ? null : $this->student($student),
            'semesters' => $semesters
                ->map(static fn (Semester $semester): array => [
                    'value' => (string) $semester->getKey(),
                    'label' => (string) $semester->label,
                ])
                ->values()
                ->all(),
            'statuses' => $this->options(self::STATUSES),
            'filters' => [
                'search' => (string) ($filters->search ?? ''),
                'status' => (string) ($filters->status ?? ''),
                'semester_id' => $filters->semesterId === null ? '' : (string) $filters->semesterId,
            ],
            'can' => $this->listPermissions($request),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function form(Student $student, ?CaseStudy $caseStudy = null): array
    {
        return [
            'student' => $this->student($student),
            'caseStudy' => $caseStudy === null ? null : [
                'id' => (int) $caseStudy->getKey(),
                'version' => (int) $caseStudy->version,
                'demand_origin' => (string) $caseStudy->demand_origin,
                'participants_summary' => RichTextSanitizer::sanitize((string) $caseStudy->participants_summary),
                'study_date' => $caseStudy->study_date?->toDateString(),
                'student_observation' => RichTextSanitizer::sanitize((string) $caseStudy->student_observation),
                'student_family_listening' => RichTextSanitizer::sanitize((string) $caseStudy->student_family_listening),
                'teachers_listening' => RichTextSanitizer::sanitize((string) $caseStudy->teachers_listening),
                'other_info' => RichTextSanitizer::sanitize((string) $caseStudy->other_info),
                'care_network_notes' => RichTextSanitizer::sanitize((string) $caseStudy->care_network_notes),
                'favorable_aspects' => RichTextSanitizer::sanitize((string) $caseStudy->favorable_aspects),
                'potentials_interests' => RichTextSanitizer::sanitize((string) $caseStudy->potentials_interests),
                'needed_supports' => array_values(array_map('strval', $caseStudy->needed_supports ?? [])),
                'needed_supports_justification' => RichTextSanitizer::sanitize((string) $caseStudy->needed_supports_justification),
                'acceptance_status' => (string) $caseStudy->acceptance_status,
                'acceptance_date' => $caseStudy->acceptance_date?->toDateString(),
                'barriers' => $caseStudy->barriers
                    ->map(static fn (CaseStudyBarrier $barrier): array => [
                        'type' => (string) $barrier->type,
                        'observed_situation' => (string) $barrier->observed_situation,
                        'participation_implication' => (string) $barrier->participation_implication,
                    ])
                    ->values()
                    ->all(),
                'strategies' => $caseStudy->strategies
                    ->map(static fn (CaseStudyStrategy $strategy): array => [
                        'description' => (string) $strategy->description,
                    ])
                    ->values()
                    ->all(),
            ],
            'options' => [
                'demandOrigins' => $this->options(self::DEMAND_ORIGINS),
                'neededSupports' => $this->options(self::NEEDED_SUPPORTS),
                'barrierTypes' => $this->options($this->barrierOptions->execute($caseStudy)),
                'acceptanceStatuses' => $this->options(self::ACCEPTANCE_STATUSES),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function show(CaseStudy $caseStudy, Request $request): array
    {
        $user = $request->user();
        $completed = $caseStudy->status === CaseStudy::STATUS_COMPLETED;
        $canUpdate = $user?->can('case-study.update') ?? false;

        return [
            'student' => $this->student($caseStudy->student),
            'caseStudy' => [
                ...$this->row($caseStudy),
                'is_current' => (bool) $caseStudy->is_current,
                'creator_name' => $caseStudy->creator?->name,
                'demand_origin_label' => AeeLabels::demandOrigin($caseStudy->demand_origin),
                'participants_summary' => RichTextSanitizer::sanitize((string) $caseStudy->participants_summary),
                'study_date' => $caseStudy->study_date?->toDateString(),
                'student_observation' => RichTextSanitizer::sanitize((string) $caseStudy->student_observation),
                'student_family_listening' => RichTextSanitizer::sanitize((string) $caseStudy->student_family_listening),
                'teachers_listening' => RichTextSanitizer::sanitize((string) $caseStudy->teachers_listening),
                'other_info' => RichTextSanitizer::sanitize((string) $caseStudy->other_info),
                'care_network_notes' => RichTextSanitizer::sanitize((string) $caseStudy->care_network_notes),
                'favorable_aspects' => RichTextSanitizer::sanitize((string) $caseStudy->favorable_aspects),
                'potentials_interests' => RichTextSanitizer::sanitize((string) $caseStudy->potentials_interests),
                'needed_supports_label' => AeeLabels::neededSupportsList($caseStudy->needed_supports),
                'needed_supports_justification' => RichTextSanitizer::sanitize((string) $caseStudy->needed_supports_justification),
                'acceptance_status_label' => AeeLabels::acceptanceStatus($caseStudy->acceptance_status),
                'acceptance_date' => $caseStudy->acceptance_date?->toDateString(),
                'completed_at' => $caseStudy->completed_at?->toIso8601String(),
                'barriers' => $caseStudy->barriers
                    ->map(static fn (CaseStudyBarrier $barrier): array => [
                        'id' => (int) $barrier->getKey(),
                        'type_label' => (string) $barrier->type,
                        'observed_situation' => (string) $barrier->observed_situation,
                        'participation_implication' => (string) $barrier->participation_implication,
                    ])
                    ->values()
                    ->all(),
                'strategies' => $caseStudy->strategies
                    ->map(static fn (CaseStudyStrategy $strategy): array => [
                        'id' => (int) $strategy->getKey(),
                        'description' => (string) $strategy->description,
                        'linked_barrier_label' => $strategy->linkedBarrier === null
                            ? null
                            : (string) $strategy->linkedBarrier->type,
                    ])
                    ->values()
                    ->all(),
                'contributions' => $caseStudy->contributions
                    ->sortBy('created_at')
                    ->map(static fn (CaseStudyContribution $contribution): array => [
                        'id' => (int) $contribution->getKey(),
                        'author_id' => $contribution->author_id === null ? null : (int) $contribution->author_id,
                        'author_name' => $contribution->author?->name,
                        'author_photo_url' => $contribution->author?->photo_url,
                        'role' => (string) $contribution->role,
                        'content' => (string) $contribution->content,
                        'created_at' => $contribution->created_at?->toIso8601String(),
                    ])
                    ->values()
                    ->all(),
            ],
            'can' => [
                'update' => ! $completed && $canUpdate,
                'complete' => ! $completed && $canUpdate,
                'contribute' => $canUpdate,
                // O backend recusa excluir um Estudo de Caso com PAEE vinculado.
                'delete' => $caseStudy->paees->isEmpty() && ($user?->can('case-study.delete') ?? false),
                'createPaee' => $completed && ($user?->can('paee.create') ?? false),
                'pdf' => $user?->can('case-study.view') ?? false,
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function row(CaseStudy $caseStudy): array
    {
        $status = (string) $caseStudy->status;

        return [
            'id' => (int) $caseStudy->getKey(),
            'version' => (int) $caseStudy->version,
            'status' => $status,
            'status_label' => self::STATUSES[$status] ?? AeeLabels::caseStudyStatus($status),
            'status_tone' => match ($status) {
                CaseStudy::STATUS_COMPLETED => 'success',
                CaseStudy::STATUS_IN_PROGRESS => 'warning',
                default => 'inverse',
            },
            'semester_label' => $caseStudy->semester?->label,
            'created_at' => $caseStudy->created_at?->toDateString(),
            'paees_count' => isset($caseStudy->paees_count) ? (int) $caseStudy->paees_count : null,
            'student' => $caseStudy->relationLoaded('student') && $caseStudy->student !== null
                ? [
                    'id' => (int) $caseStudy->student->getKey(),
                    'name' => (string) ($caseStudy->student->person?->name ?? ''),
                ]
                : null,
        ];
    }

    /**
     * @return array{id: int, name: string, registration: string|null, photo_url: string|null}
     */
    private function student(Student $student): array
    {
        $student->loadMissing('person');

        return [
            'id' => (int) $student->getKey(),
            'name' => (string) ($student->person?->name ?? ''),
            'registration' => $student->registration,
            'photo_url' => $student->person?->photo_url,
        ];
    }

    /**
     * @return array{create: bool, view: bool, update: bool, delete: bool}
     */
    private function listPermissions(Request $request): array
    {
        $user = $request->user();

        return [
            'create' => $user?->can('case-study.create') ?? false,
            'view' => $user?->can('case-study.view') ?? false,
            'update' => $user?->can('case-study.update') ?? false,
            'delete' => $user?->can('case-study.delete') ?? false,
        ];
    }

    /**
     * @param  array<string, string>  $map
     * @return list<array{value: string, label: string}>
     */
    private function options(array $map): array
    {
        $options = [];

        foreach ($map as $value => $label) {
            $options[] = ['value' => $value, 'label' => $label];
        }

        return $options;
    }
}

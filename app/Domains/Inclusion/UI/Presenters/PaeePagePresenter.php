<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\UI\Presenters;

use App\Domains\Inclusion\Application\Data\Paees\ListPaeesData;
use App\Domains\Inclusion\Domain\Models\CaseStudy;
use App\Domains\Inclusion\Domain\Models\CaseStudyBarrier;
use App\Domains\Inclusion\Domain\Models\Item;
use App\Domains\Inclusion\Domain\Models\Paee;
use App\Domains\Inclusion\Domain\Models\PaeeObjective;
use App\Domains\Inclusion\Domain\Models\PaeeResource;
use App\Domains\Inclusion\Domain\Models\PaeeReview;
use App\Domains\Inclusion\Domain\Models\Semester;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Shared\Domain\Support\AeeLabels;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

final class PaeePagePresenter
{
    /**
     * @param  LengthAwarePaginator<int, Paee>  $paees
     * @param  Collection<int, Semester>  $semesters
     * @return array<string, mixed>
     */
    public function list(
        LengthAwarePaginator $paees,
        Collection $semesters,
        ListPaeesData $filters,
        Request $request,
        ?Student $student = null,
    ): array {
        return [
            'paees' => $paees->through(fn (Paee $paee): array => $this->row($paee)),
            'student' => $student === null ? null : $this->studentSummary($student),
            'semesters' => $semesters
                ->map(static fn (Semester $semester): array => [
                    'value' => (string) $semester->getKey(),
                    'label' => (string) $semester->label,
                ])
                ->values()
                ->all(),
            'filters' => [
                'status' => (string) ($filters->status ?? ''),
                'semester_id' => $filters->semesterId === null ? '' : (string) $filters->semesterId,
                'search' => (string) ($filters->search ?? ''),
            ],
            'can' => $this->listPermissions($request),
        ];
    }

    /**
     * @param  Collection<int, Paee>  $paees
     * @return array<string, mixed>
     */
    public function history(Student $student, Collection $paees, Request $request): array
    {
        return [
            'student' => $this->studentSummary($student),
            'paees' => $paees
                ->map(fn (Paee $paee): array => $this->row($paee->setRelation('student', $student)))
                ->values()
                ->all(),
            'can' => $this->listPermissions($request),
        ];
    }

    /**
     * @param  EloquentCollection<int, Item>  $assistiveTechnologies
     * @return array<string, mixed>
     */
    public function create(CaseStudy $caseStudy, EloquentCollection $assistiveTechnologies): array
    {
        return [
            'caseStudy' => [
                'id' => (int) $caseStudy->getKey(),
                'version' => $caseStudy->version,
            ],
            'student' => $this->studentSummary($caseStudy->student),
            'options' => $this->formOptions($caseStudy, $assistiveTechnologies),
        ];
    }

    /**
     * @param  EloquentCollection<int, Item>  $assistiveTechnologies
     * @return array<string, mixed>
     */
    public function edit(Paee $paee, EloquentCollection $assistiveTechnologies): array
    {
        return [
            'paee' => [
                'id' => (int) $paee->getKey(),
                'version' => $paee->version,
                'attendance_frequency_per_week' => $paee->attendance_frequency_per_week,
                'attendance_duration_minutes' => $paee->attendance_duration_minutes,
                'attendance_format' => $paee->attendance_format,
                'attendance_location' => $paee->attendance_location,
                'assistive_technology_needed' => (bool) $paee->assistive_technology_needed,
                'assistive_technology_notes' => RichTextSanitizer::sanitize((string) $paee->assistive_technology_notes),
                'assistive_technology_availability_capacity' => RichTextSanitizer::sanitize((string) $paee->assistive_technology_availability_capacity),
                'caa_needed' => (bool) $paee->caa_needed,
                'caa_notes' => RichTextSanitizer::sanitize((string) $paee->caa_notes),
                'is_assistive_technology_portable_digital_device' => (bool) $paee->is_assistive_technology_portable_digital_device,
                'assistive_technology_pedagogical_opinion' => RichTextSanitizer::sanitize((string) $paee->assistive_technology_pedagogical_opinion),
                'support_professional_needed' => (bool) $paee->support_professional_needed,
                'support_professional_justification' => RichTextSanitizer::sanitize((string) $paee->support_professional_justification),
                'libras_interpreter_needed' => (bool) $paee->libras_interpreter_needed,
                'libras_interpreter_justification' => RichTextSanitizer::sanitize((string) $paee->libras_interpreter_justification),
                'guide_interpreter_needed' => (bool) $paee->guide_interpreter_needed,
                'guide_interpreter_justification' => RichTextSanitizer::sanitize((string) $paee->guide_interpreter_justification),
                'school_professionals_orientation' => RichTextSanitizer::sanitize((string) $paee->school_professionals_orientation),
                'common_teachers_articulation' => RichTextSanitizer::sanitize((string) $paee->common_teachers_articulation),
                'family_articulation' => RichTextSanitizer::sanitize((string) $paee->family_articulation),
                'intersectoral_articulation' => RichTextSanitizer::sanitize((string) $paee->intersectoral_articulation),
                'training_demands' => RichTextSanitizer::sanitize((string) $paee->training_demands),
                'objectives' => $paee->objectives
                    ->map(static fn (PaeeObjective $objective): array => [
                        'description' => $objective->description,
                        'term' => $objective->term,
                        'linked_barrier_id' => $objective->linked_barrier_id,
                    ])
                    ->values()
                    ->all(),
                'resources' => $paee->resources
                    ->map(static fn (PaeeResource $resource): array => [
                        'description' => $resource->description,
                        'acquisition_type' => $resource->acquisition_type,
                        'assistive_technology_id' => $resource->assistive_technology_id,
                    ])
                    ->values()
                    ->all(),
            ],
            'student' => $this->studentSummary($paee->student),
            'options' => $this->formOptions($paee->caseStudy, $assistiveTechnologies),
        ];
    }

    /**
     * Barreiras do Estudo de Caso que fundamenta o PAEE e tecnologias assistivas do catálogo de itens.
     *
     * @param  EloquentCollection<int, Item>  $assistiveTechnologies
     * @return array{barriers: list<array{value: string, label: string}>, assistiveTechnologies: list<array{value: string, label: string}>}
     */
    private function formOptions(?CaseStudy $caseStudy, EloquentCollection $assistiveTechnologies): array
    {
        return [
            'barriers' => ($caseStudy?->barriers ?? new EloquentCollection())
                ->map(static fn (CaseStudyBarrier $barrier): array => [
                    'value' => (string) $barrier->getKey(),
                    'label' => self::barrierOptionLabel($barrier),
                ])
                ->values()
                ->all(),
            'assistiveTechnologies' => $assistiveTechnologies
                ->map(static fn (Item $item): array => [
                    'value' => (string) $item->getKey(),
                    'label' => $item->asset_code ? "{$item->name} ({$item->asset_code})" : (string) $item->name,
                ])
                ->values()
                ->all(),
        ];
    }

    private static function barrierOptionLabel(CaseStudyBarrier $barrier): string
    {
        $situation = Str::limit(
            trim(preg_replace('/\s+/u', ' ', html_entity_decode(strip_tags((string) $barrier->observed_situation))) ?? ''),
            80,
        );
        $type = AeeLabels::barrierType($barrier->type);

        return $situation === '' ? $type : "{$type}: {$situation}";
    }

    /**
     * @return array<string, mixed>
     */
    public function show(Paee $paee, Request $request): array
    {
        $user = $request->user();

        return [
            'paee' => [
                'id' => (int) $paee->getKey(),
                'version' => $paee->version,
                'is_current' => (bool) $paee->is_current,
                'status' => $paee->status,
                'status_label' => AeeLabels::paeeStatus($paee->status),
                'semester_label' => $paee->semester?->label,
                'creator_name' => $paee->creator?->name,
                'created_at' => $paee->created_at?->toDateString(),
                'next_review_date' => $paee->next_review_date?->toDateString(),
                'case_study' => $paee->caseStudy === null ? null : [
                    'id' => (int) $paee->caseStudy->getKey(),
                    'version' => $paee->caseStudy->version,
                ],
                'attendance_frequency_per_week' => $paee->attendance_frequency_per_week,
                'attendance_duration_minutes' => $paee->attendance_duration_minutes,
                'attendance_format_label' => AeeLabels::attendanceFormat($paee->attendance_format),
                'attendance_location_label' => AeeLabels::attendanceLocation($paee->attendance_location),
                'assistive_technology_needed' => (bool) $paee->assistive_technology_needed,
                'assistive_technology_notes' => RichTextSanitizer::sanitize((string) $paee->assistive_technology_notes),
                'assistive_technology_availability_capacity' => RichTextSanitizer::sanitize((string) $paee->assistive_technology_availability_capacity),
                'caa_needed' => (bool) $paee->caa_needed,
                'caa_notes' => RichTextSanitizer::sanitize((string) $paee->caa_notes),
                'is_assistive_technology_portable_digital_device' => (bool) $paee->is_assistive_technology_portable_digital_device,
                'assistive_technology_pedagogical_opinion' => RichTextSanitizer::sanitize((string) $paee->assistive_technology_pedagogical_opinion),
                'support_professional_needed' => (bool) $paee->support_professional_needed,
                'support_professional_justification' => RichTextSanitizer::sanitize((string) $paee->support_professional_justification),
                'libras_interpreter_needed' => (bool) $paee->libras_interpreter_needed,
                'libras_interpreter_justification' => RichTextSanitizer::sanitize((string) $paee->libras_interpreter_justification),
                'guide_interpreter_needed' => (bool) $paee->guide_interpreter_needed,
                'guide_interpreter_justification' => RichTextSanitizer::sanitize((string) $paee->guide_interpreter_justification),
                'school_professionals_orientation' => RichTextSanitizer::sanitize((string) $paee->school_professionals_orientation),
                'common_teachers_articulation' => RichTextSanitizer::sanitize((string) $paee->common_teachers_articulation),
                'family_articulation' => RichTextSanitizer::sanitize((string) $paee->family_articulation),
                'intersectoral_articulation' => RichTextSanitizer::sanitize((string) $paee->intersectoral_articulation),
                'training_demands' => RichTextSanitizer::sanitize((string) $paee->training_demands),
                'objectives' => $paee->objectives
                    ->map(static fn (PaeeObjective $objective): array => [
                        'id' => (int) $objective->getKey(),
                        'description' => $objective->description,
                        'term_label' => AeeLabels::objectiveTerm($objective->term),
                        'linked_barrier' => $objective->linkedBarrier === null ? null : [
                            'type_label' => AeeLabels::barrierType($objective->linkedBarrier->type),
                            'observed_situation' => $objective->linkedBarrier->observed_situation,
                        ],
                    ])
                    ->values()
                    ->all(),
                'resources' => $paee->resources
                    ->map(static fn (PaeeResource $resource): array => [
                        'id' => (int) $resource->getKey(),
                        'description' => $resource->description,
                        'acquisition_type_label' => AeeLabels::acquisitionType($resource->acquisition_type),
                        'assistive_technology_name' => $resource->assistiveTechnology?->name,
                    ])
                    ->values()
                    ->all(),
                'reviews' => $paee->reviews
                    ->map(static fn (PaeeReview $review): array => [
                        'id' => (int) $review->getKey(),
                        'reviewed_at' => $review->reviewed_at?->toDateString(),
                        'reviewer_name' => $review->reviewer?->name,
                        'what_changed' => RichTextSanitizer::sanitize((string) $review->what_changed),
                        'why' => RichTextSanitizer::sanitize((string) $review->why),
                    ])
                    ->values()
                    ->all(),
            ],
            'student' => $this->studentSummary($paee->student),
            'can' => [
                'update' => $user?->can('paee.update') ?? false,
                'delete' => $user?->can('paee.delete') ?? false,
                'viewCaseStudy' => $user?->can('case-study.view') ?? false,
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function row(Paee $paee): array
    {
        return [
            'id' => (int) $paee->getKey(),
            'version' => $paee->version,
            'is_current' => (bool) $paee->is_current,
            'status' => $paee->status,
            'status_label' => AeeLabels::paeeStatus($paee->status),
            'semester_label' => $paee->semester?->label,
            'next_review_date' => $paee->next_review_date?->toDateString(),
            'student' => $paee->student === null ? null : $this->studentSummary($paee->student),
        ];
    }

    /**
     * @return array{id: int, name: string}
     */
    private function studentSummary(Student $student): array
    {
        $student->loadMissing('person');

        return [
            'id' => (int) $student->getKey(),
            'name' => (string) ($student->person?->name ?? ''),
        ];
    }

    /**
     * @return array{view: bool, update: bool, delete: bool}
     */
    private function listPermissions(Request $request): array
    {
        $user = $request->user();

        return [
            'view' => $user?->can('paee.view') ?? false,
            'update' => $user?->can('paee.update') ?? false,
            'delete' => $user?->can('paee.delete') ?? false,
        ];
    }
}

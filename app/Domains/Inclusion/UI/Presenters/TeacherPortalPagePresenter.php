<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\UI\Presenters;

use App\Domains\Inclusion\Domain\Enums\StudentDocumentType;
use App\Domains\Inclusion\Domain\Models\CaseStudy;
use App\Domains\Inclusion\Domain\Models\CaseStudyBarrier;
use App\Domains\Inclusion\Domain\Models\CaseStudyContribution;
use App\Domains\Inclusion\Domain\Models\CaseStudyStrategy;
use App\Domains\Inclusion\Domain\Models\Paee;
use App\Domains\Inclusion\Domain\Models\PaeeObjective;
use App\Domains\Inclusion\Domain\Models\PaeeResource;
use App\Domains\Inclusion\Domain\Models\PaeeReview;
use App\Domains\Inclusion\Domain\Models\Pei;
use App\Domains\Inclusion\Domain\Models\PeiDiscipline;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Domains\Inclusion\Domain\Models\StudentDocument;
use App\Shared\Domain\Support\AeeLabels;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Support\Collection;

/**
 * Dados das telas do Portal do Professor (modo leitura do aluno e edição da
 * própria adaptação do PEI), no formato consumido pelas páginas React.
 */
final class TeacherPortalPagePresenter
{
    /**
     * @param  Collection<int, PeiDiscipline>  $assignments
     * @return array<string, mixed>
     */
    public function index(Collection $assignments): array
    {
        return [
            'assignments' => $assignments
                ->map(static fn (PeiDiscipline $item): array => [
                    'id' => (int) $item->getKey(),
                    'student_id' => (int) $item->pei->student_id,
                    'student_name' => (string) ($item->pei->student->person?->name ?? ''),
                    'discipline_name' => $item->discipline?->name,
                    'course_name' => $item->pei->course?->name,
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function student(Student $student, int $teacherId): array
    {
        $caseStudy = $student->currentCaseStudy;
        $paee = $student->currentPaee;
        $pei = $student->peis->first();

        return [
            'student' => [
                'id' => (int) $student->getKey(),
                'name' => (string) ($student->person?->name ?? ''),
                'registration' => $student->registration,
                'photo_url' => $student->person?->photo_url,
            ],
            'status' => [
                'has_laudo' => $student->documents
                    ->contains(static fn (StudentDocument $document): bool => $document->type === StudentDocumentType::TECHNICAL_REPORT),
                'has_case_study' => $caseStudy !== null,
                'has_paee' => $paee !== null,
                'has_pei' => $pei !== null,
            ],
            'documents' => $student->documents
                ->map(static fn (StudentDocument $document): array => [
                    'id' => (int) $document->getKey(),
                    'type_label' => $document->type?->label(),
                    'title' => $document->title,
                    'created_at' => $document->created_at?->format('d/m/Y'),
                ])
                ->values()
                ->all(),
            'caseStudy' => $caseStudy instanceof CaseStudy ? $this->caseStudy($caseStudy) : null,
            'paee' => $paee instanceof Paee ? $this->paee($paee) : null,
            'pei' => $pei instanceof Pei ? $this->pei($pei, $teacherId) : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function discipline(PeiDiscipline $peiDiscipline): array
    {
        return [
            'peiDiscipline' => [
                'id' => (int) $peiDiscipline->getKey(),
                'discipline_name' => $peiDiscipline->discipline?->name,
                'student_id' => (int) $peiDiscipline->pei->student_id,
                'student_name' => (string) ($peiDiscipline->pei->student->person?->name ?? ''),
                'specific_objectives' => $peiDiscipline->specific_objectives,
                'objectives_deadline' => $peiDiscipline->objectives_deadline,
                'content_programmatic' => $peiDiscipline->content_programmatic,
                'curricular_reference' => $peiDiscipline->curricular_reference,
                'methodologies' => $peiDiscipline->methodologies,
                'materials_and_assistive_technology' => $peiDiscipline->materials_and_assistive_technology,
                'evaluations' => $peiDiscipline->evaluations,
                'opinion' => $peiDiscipline->opinion,
                'complementary_records' => $peiDiscipline->complementary_records,
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function caseStudy(CaseStudy $caseStudy): array
    {
        return [
            'version' => $caseStudy->version,
            'status_label' => AeeLabels::caseStudyStatus($caseStudy->status),
            'semester_label' => $caseStudy->semester?->label,
            'demand_origin_label' => AeeLabels::demandOrigin($caseStudy->demand_origin),
            'student_observation' => RichTextSanitizer::sanitize((string) $caseStudy->student_observation),
            'student_family_listening' => RichTextSanitizer::sanitize((string) $caseStudy->student_family_listening),
            'teachers_listening' => RichTextSanitizer::sanitize((string) $caseStudy->teachers_listening),
            'favorable_aspects' => RichTextSanitizer::sanitize((string) $caseStudy->favorable_aspects),
            'potentials_interests' => RichTextSanitizer::sanitize((string) $caseStudy->potentials_interests),
            'other_info' => RichTextSanitizer::sanitize((string) $caseStudy->other_info),
            'barriers' => $caseStudy->barriers
                ->map(static fn (CaseStudyBarrier $barrier): array => [
                    'id' => (int) $barrier->getKey(),
                    'type_label' => AeeLabels::barrierType($barrier->type),
                    'observed_situation' => $barrier->observed_situation,
                    'participation_implication' => $barrier->participation_implication,
                ])
                ->values()
                ->all(),
            'strategies' => $caseStudy->strategies
                ->map(static fn (CaseStudyStrategy $strategy): array => [
                    'id' => (int) $strategy->getKey(),
                    'description' => $strategy->description,
                    'linked_barrier_label' => $strategy->linkedBarrier !== null
                        ? AeeLabels::barrierType($strategy->linkedBarrier->type)
                        : null,
                ])
                ->values()
                ->all(),
            'contributions' => $caseStudy->contributions
                ->map(static fn (CaseStudyContribution $contribution): array => [
                    'id' => (int) $contribution->getKey(),
                    'author_name' => $contribution->author?->name,
                    'role' => $contribution->role,
                    'created_at' => $contribution->created_at?->format('d/m/Y'),
                    'content' => $contribution->content,
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function paee(Paee $paee): array
    {
        return [
            'version' => $paee->version,
            'status_label' => AeeLabels::paeeStatus($paee->status),
            'attendance_frequency_per_week' => $paee->attendance_frequency_per_week,
            'attendance_duration_minutes' => $paee->attendance_duration_minutes,
            'attendance_format_label' => AeeLabels::attendanceFormat($paee->attendance_format),
            'attendance_location_label' => AeeLabels::attendanceLocation($paee->attendance_location),
            'assistive_technology_needed' => (bool) $paee->assistive_technology_needed,
            'support_professional_needed' => (bool) $paee->support_professional_needed,
            'assistive_technology_notes' => RichTextSanitizer::sanitize((string) $paee->assistive_technology_notes),
            'school_professionals_orientation' => RichTextSanitizer::sanitize((string) $paee->school_professionals_orientation),
            'common_teachers_articulation' => RichTextSanitizer::sanitize((string) $paee->common_teachers_articulation),
            'family_articulation' => RichTextSanitizer::sanitize((string) $paee->family_articulation),
            'objectives' => $paee->objectives
                ->map(static fn (PaeeObjective $objective): array => [
                    'id' => (int) $objective->getKey(),
                    'description' => $objective->description,
                    'term_label' => AeeLabels::objectiveTerm($objective->term),
                ])
                ->values()
                ->all(),
            'resources' => $paee->resources
                ->map(static fn (PaeeResource $resource): array => [
                    'id' => (int) $resource->getKey(),
                    'description' => $resource->description,
                    'acquisition_type_label' => AeeLabels::acquisitionType($resource->acquisition_type),
                ])
                ->values()
                ->all(),
            'reviews' => $paee->reviews
                ->map(static fn (PaeeReview $review): array => [
                    'id' => (int) $review->getKey(),
                    'reviewed_at' => $review->reviewed_at?->format('d/m/Y'),
                    'reviewer_name' => $review->reviewer?->name,
                    'what_changed' => RichTextSanitizer::sanitize((string) $review->what_changed),
                    'why' => RichTextSanitizer::sanitize((string) $review->why),
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function pei(Pei $pei, int $teacherId): array
    {
        return [
            'version' => $pei->version,
            'is_finished' => (bool) $pei->is_finished,
            'disciplines' => $pei->peiDisciplines
                ->map(fn (PeiDiscipline $item): array => [
                    'id' => (int) $item->getKey(),
                    'discipline_name' => $item->discipline?->name,
                    'teacher_name' => $item->teacher?->person?->name,
                    'specific_objectives_html' => $this->richText($item->specific_objectives),
                    'content_programmatic_html' => $this->richText($item->content_programmatic),
                    'methodologies_html' => $this->richText($item->methodologies),
                    'evaluations_html' => $this->richText($item->evaluations),
                    'opinion_html' => filled($item->opinion) ? $this->richText($item->opinion) : null,
                    'can_edit' => (int) $item->teacher_id === $teacherId,
                ])
                ->values()
                ->all(),
        ];
    }

    /** Texto simples mantém as quebras de linha; HTML é sanitizado como no PEI administrativo. */
    private function richText(?string $value): string
    {
        $value = trim((string) $value);

        if ($value === '') {
            return e('---');
        }

        if ($value === strip_tags($value)) {
            return nl2br(e($value), false);
        }

        return RichTextSanitizer::sanitize($value);
    }
}

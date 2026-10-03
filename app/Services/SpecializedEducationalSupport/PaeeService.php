<?php

namespace App\Services\SpecializedEducationalSupport;

use App\Enums\SpecializedEducationalSupport\CaseStudyStatus;
use App\Enums\SpecializedEducationalSupport\PaeeStatus;
use App\Models\SpecializedEducationalSupport\CaseStudy;
use App\Models\SpecializedEducationalSupport\Paee;
use App\Models\SpecializedEducationalSupport\Student;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PaeeService
{
    protected SemesterService $semesterService;

    public function __construct(SemesterService $semesterService)
    {
        $this->semesterService = $semesterService;
    }

    public function all(array $filters = [])
    {
        return Paee::query()
            ->with(['student.person', 'semester', 'creator', 'caseStudy'])
            ->student($filters['student_id'] ?? null)
            ->status($filters['status'] ?? null)
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }

    public function index(Student $student, array $filters = [])
    {
        return Paee::query()
            ->where('student_id', $student->id)
            ->with(['semester', 'creator', 'caseStudy'])
            ->status($filters['status'] ?? null)
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }

    public function getCurrent(Student $student): ?Paee
    {
        return Paee::where('student_id', $student->id)
            ->where('is_current', true)
            ->first();
    }

    /**
     * Cria o PAEE vinculado a um Estudo de Caso concluído.
     */
    public function create(CaseStudy $caseStudy, array $data): Paee
    {
        return DB::transaction(function () use ($caseStudy, $data) {
            if ($caseStudy->status !== CaseStudyStatus::COMPLETED) {
                throw new \DomainException('O Estudo de Caso vinculado precisa estar concluído para gerar um PAEE.');
            }

            $student = $caseStudy->student;
            $current = $this->getCurrent($student);

            if ($current && $current->status !== PaeeStatus::UNDER_REVIEW) {
                throw new \DomainException('Este aluno já possui um PAEE vigente. Registre uma revisão antes de criar uma nova versão.');
            }

            $semesterId = $this->semesterService->getCurrent()?->id;
            if (!$semesterId) {
                throw new \DomainException('O sistema não possui semestre atual cadastrado.');
            }

            if ($current) {
                $current->update(['is_current' => false]);
            }

            $paee = Paee::create([
                'case_study_id' => $caseStudy->id,
                'student_id' => $student->id,
                'creator_id' => Auth::id(),
                'semester_id' => $semesterId,
                'version' => $current ? ($current->version + 1) : 1,
                'is_current' => true,
                'status' => PaeeStatus::ACTIVE->value,
                'attendance_frequency_per_week' => $data['attendance_frequency_per_week'],
                'attendance_duration_minutes' => $data['attendance_duration_minutes'],
                'attendance_format' => $data['attendance_format'],
                'attendance_location' => $data['attendance_location'],
                'assistive_technology_needed' => (bool) ($data['assistive_technology_needed'] ?? false),
                'assistive_technology_notes' => $data['assistive_technology_notes'] ?? null,
                'support_professional_needed' => (bool) ($data['support_professional_needed'] ?? false),
                'support_professional_justification' => $data['support_professional_justification'] ?? null,
                'school_professionals_orientation' => $data['school_professionals_orientation'] ?? null,
                'common_teachers_articulation' => $data['common_teachers_articulation'] ?? null,
                'family_articulation' => $data['family_articulation'] ?? null,
                'intersectoral_articulation' => $data['intersectoral_articulation'] ?? null,
                'training_demands' => $data['training_demands'] ?? null,
                'next_review_date' => now()->addMonths(12)->toDateString(),
            ]);

            $this->syncObjectivesAndResources($paee, $data);

            return $paee;
        });
    }

    public function update(Paee $paee, array $data): Paee
    {
        $paee->ensureIsOwner();
        $paee->ensureCanBeEdited();

        return DB::transaction(function () use ($paee, $data) {
            $paee->update([
                'attendance_frequency_per_week' => $data['attendance_frequency_per_week'],
                'attendance_duration_minutes' => $data['attendance_duration_minutes'],
                'attendance_format' => $data['attendance_format'],
                'attendance_location' => $data['attendance_location'],
                'assistive_technology_needed' => (bool) ($data['assistive_technology_needed'] ?? false),
                'assistive_technology_notes' => $data['assistive_technology_notes'] ?? null,
                'support_professional_needed' => (bool) ($data['support_professional_needed'] ?? false),
                'support_professional_justification' => $data['support_professional_justification'] ?? null,
                'school_professionals_orientation' => $data['school_professionals_orientation'] ?? null,
                'common_teachers_articulation' => $data['common_teachers_articulation'] ?? null,
                'family_articulation' => $data['family_articulation'] ?? null,
                'intersectoral_articulation' => $data['intersectoral_articulation'] ?? null,
                'training_demands' => $data['training_demands'] ?? null,
            ]);

            $this->syncObjectivesAndResources($paee, $data);

            return $paee;
        });
    }

    protected function syncObjectivesAndResources(Paee $paee, array $data): void
    {
        if (array_key_exists('objectives', $data)) {
            $paee->objectives()->delete();

            foreach ($data['objectives'] ?? [] as $objective) {
                $paee->objectives()->create([
                    'linked_barrier_id' => $objective['linked_barrier_id'] ?? null,
                    'description' => $objective['description'],
                    'term' => $objective['term'],
                ]);
            }
        }

        if (array_key_exists('resources', $data)) {
            $paee->resources()->delete();

            foreach ($data['resources'] ?? [] as $resource) {
                $paee->resources()->create([
                    'description' => $resource['description'],
                    'acquisition_type' => $resource['acquisition_type'],
                    'assistive_technology_id' => $resource['assistive_technology_id'] ?? null,
                ]);
            }
        }
    }

    public function delete(Paee $paee): void
    {
        $paee->ensureIsOwner();

        DB::transaction(function () use ($paee) {
            $paee->delete();
        });
    }

    public function addReview(Paee $paee, array $data): Paee
    {
        return DB::transaction(function () use ($paee, $data) {
            $paee->reviews()->create([
                'reviewed_at' => $data['reviewed_at'],
                'what_changed' => $data['what_changed'],
                'why' => $data['why'],
                'reviewer_id' => Auth::id(),
            ]);

            $paee->update([
                'status' => PaeeStatus::UNDER_REVIEW->value,
                'next_review_date' => now()->addMonths(12)->toDateString(),
            ]);

            return $paee;
        });
    }

    public function reactivate(Paee $paee): Paee
    {
        $paee->ensureIsOwner();

        $paee->update(['status' => PaeeStatus::ACTIVE->value]);

        return $paee;
    }
}

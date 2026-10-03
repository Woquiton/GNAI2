<?php

namespace App\Services\SpecializedEducationalSupport;

use App\Enums\SpecializedEducationalSupport\CaseStudyStatus;
use App\Models\SpecializedEducationalSupport\CaseStudy;
use App\Models\SpecializedEducationalSupport\Student;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CaseStudyService
{
    protected SemesterService $semesterService;

    public function __construct(SemesterService $semesterService)
    {
        $this->semesterService = $semesterService;
    }

    public function all(array $filters = [])
    {
        return CaseStudy::query()
            ->with(['student.person', 'semester', 'creator'])
            ->student($filters['student_id'] ?? null)
            ->status($filters['status'] ?? null)
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }

    public function index(Student $student, array $filters = [])
    {
        return CaseStudy::query()
            ->where('student_id', $student->id)
            ->with(['semester', 'creator'])
            ->status($filters['status'] ?? null)
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }

    public function getCurrent(Student $student): ?CaseStudy
    {
        return CaseStudy::where('student_id', $student->id)
            ->where('is_current', true)
            ->first();
    }

    /**
     * Cria um novo Estudo de Caso para o aluno. Se já existir um Estudo de Caso
     * concluído, cria uma nova versão; se existir um em andamento, impede duplicidade.
     */
    public function create(Student $student, array $data): CaseStudy
    {
        return DB::transaction(function () use ($student, $data) {
            $current = $this->getCurrent($student);

            if ($current && $current->status !== CaseStudyStatus::COMPLETED) {
                throw new \DomainException('Este aluno já possui um Estudo de Caso em andamento. Finalize-o antes de criar outro.');
            }

            $semesterId = $this->semesterService->getCurrent()?->id;
            if (!$semesterId) {
                throw new \DomainException('O sistema não possui semestre atual cadastrado.');
            }

            if ($current) {
                $current->update(['is_current' => false]);
            }

            $caseStudy = CaseStudy::create([
                'student_id' => $student->id,
                'creator_id' => Auth::id(),
                'semester_id' => $semesterId,
                'version' => $current ? ($current->version + 1) : 1,
                'is_current' => true,
                'status' => CaseStudyStatus::IN_PROGRESS->value,
                'demand_origin' => $data['demand_origin'],
                'participants_summary' => $data['participants_summary'] ?? null,
                'student_observation' => $data['student_observation'],
                'student_family_listening' => $data['student_family_listening'],
                'teachers_listening' => $data['teachers_listening'],
                'other_info' => $data['other_info'] ?? null,
                'care_network_notes' => $data['care_network_notes'] ?? null,
                'favorable_aspects' => $data['favorable_aspects'],
                'potentials_interests' => $data['potentials_interests'],
                'needed_supports' => $data['needed_supports'],
                'needed_supports_justification' => $data['needed_supports_justification'] ?? null,
                'acceptance_status' => $data['acceptance_status'],
                'acceptance_date' => $data['acceptance_date'] ?? null,
            ]);

            $barriersMap = [];
            foreach ($data['barriers'] ?? [] as $index => $barrier) {
                $created = $caseStudy->barriers()->create([
                    'type' => $barrier['type'],
                    'observed_situation' => $barrier['observed_situation'],
                    'participation_implication' => $barrier['participation_implication'],
                ]);

                $barriersMap[$index] = $created->id;
            }

            foreach ($data['strategies'] ?? [] as $strategy) {
                $linkedBarrierIndex = $strategy['linked_barrier_index'] ?? null;

                $caseStudy->strategies()->create([
                    'linked_barrier_id' => $linkedBarrierIndex !== null && $linkedBarrierIndex !== ''
                        ? ($barriersMap[$linkedBarrierIndex] ?? null)
                        : null,
                    'description' => $strategy['description'],
                ]);
            }

            $caseStudy->contributions()->create([
                'author_id' => Auth::id(),
                'role' => 'Responsável pelo cadastro',
                'content' => 'Estudo de Caso criado.',
                'created_at' => now(),
            ]);

            return $caseStudy;
        });
    }

    public function update(CaseStudy $caseStudy, array $data): CaseStudy
    {
        $caseStudy->ensureIsOwner();
        $caseStudy->ensureCanBeEdited();

        return DB::transaction(function () use ($caseStudy, $data) {
            $caseStudy->update([
                'demand_origin' => $data['demand_origin'],
                'participants_summary' => $data['participants_summary'] ?? null,
                'student_observation' => $data['student_observation'],
                'student_family_listening' => $data['student_family_listening'],
                'teachers_listening' => $data['teachers_listening'],
                'other_info' => $data['other_info'] ?? null,
                'care_network_notes' => $data['care_network_notes'] ?? null,
                'favorable_aspects' => $data['favorable_aspects'],
                'potentials_interests' => $data['potentials_interests'],
                'needed_supports' => $data['needed_supports'],
                'needed_supports_justification' => $data['needed_supports_justification'] ?? null,
                'acceptance_status' => $data['acceptance_status'],
                'acceptance_date' => $data['acceptance_date'] ?? null,
            ]);

            if (array_key_exists('barriers', $data)) {
                $caseStudy->strategies()->update(['linked_barrier_id' => null]);
                $caseStudy->barriers()->delete();

                $barriersMap = [];
                foreach ($data['barriers'] ?? [] as $index => $barrier) {
                    $created = $caseStudy->barriers()->create([
                        'type' => $barrier['type'],
                        'observed_situation' => $barrier['observed_situation'],
                        'participation_implication' => $barrier['participation_implication'],
                    ]);

                    $barriersMap[$index] = $created->id;
                }

                $caseStudy->strategies()->delete();
                foreach ($data['strategies'] ?? [] as $strategy) {
                    $linkedBarrierIndex = $strategy['linked_barrier_index'] ?? null;

                    $caseStudy->strategies()->create([
                        'linked_barrier_id' => $linkedBarrierIndex !== null && $linkedBarrierIndex !== ''
                            ? ($barriersMap[$linkedBarrierIndex] ?? null)
                            : null,
                        'description' => $strategy['description'],
                    ]);
                }
            }

            return $caseStudy;
        });
    }

    public function complete(CaseStudy $caseStudy): CaseStudy
    {
        $caseStudy->ensureIsOwner();

        $caseStudy->loadMissing('barriers', 'strategies');

        if ($caseStudy->barriers->isEmpty()) {
            throw new \DomainException('Cadastre ao menos uma barreira antes de concluir o Estudo de Caso.');
        }

        if ($caseStudy->strategies->isEmpty()) {
            throw new \DomainException('Cadastre ao menos uma estratégia/recurso antes de concluir o Estudo de Caso.');
        }

        DB::transaction(function () use ($caseStudy) {
            $caseStudy->update([
                'status' => CaseStudyStatus::COMPLETED->value,
                'completed_at' => now(),
            ]);
        });

        return $caseStudy;
    }

    public function delete(CaseStudy $caseStudy): void
    {
        $caseStudy->ensureIsOwner();

        DB::transaction(function () use ($caseStudy) {
            $caseStudy->delete();
        });
    }

    public function addContribution(CaseStudy $caseStudy, array $data): CaseStudy
    {
        $caseStudy->contributions()->create([
            'author_id' => Auth::id(),
            'role' => $data['role'],
            'content' => $data['content'],
            'created_at' => now(),
        ]);

        return $caseStudy;
    }
}

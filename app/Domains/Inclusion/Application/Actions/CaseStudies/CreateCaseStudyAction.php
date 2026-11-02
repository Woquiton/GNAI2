<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Actions\CaseStudies;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\Inclusion\Application\Data\CaseStudies\CreateCaseStudyData;
use App\Domains\Inclusion\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domains\Inclusion\Domain\DTOs\CaseStudies\CaseStudyDTO;
use App\Domains\Inclusion\Domain\Exceptions\InvalidCaseStudy;
use App\Domains\Inclusion\Domain\Models\CaseStudy;
use App\Domains\Inclusion\Domain\Models\CaseStudyBarrier;
use App\Domains\Inclusion\Domain\Models\CaseStudyContribution;
use App\Domains\Inclusion\Domain\Models\CaseStudyStrategy;
use App\Domains\Inclusion\Domain\Models\Student;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreateCaseStudyAction
{
    public function __construct(
        private CurrentSemesterQuery $currentSemesterQuery,
    ) {}

    /**
     * @throws InvalidCaseStudy
     * @throws Throwable
     */
    public function execute(Student $student, CreateCaseStudyData $data, User $creator): CaseStudy
    {
        return DB::transaction(function () use ($student, $data, $creator): CaseStudy {
            $lockedStudent = Student::query()->lockForUpdate()->findOrFail($student->getKey());

            $currentCaseStudy = CaseStudy::query()
                ->where('student_id', $lockedStudent->getKey())
                ->where('is_current', true)
                ->lockForUpdate()
                ->first();

            $version = 1;
            if ($currentCaseStudy instanceof CaseStudy) {
                if ($currentCaseStudy->status !== CaseStudy::STATUS_COMPLETED) {
                    throw new InvalidCaseStudy('Já existe um Estudo de Caso em andamento para este aluno. Conclua-o antes de criar um novo.');
                }
                $version = ((int) $currentCaseStudy->version) + 1;
                $currentCaseStudy->markAsHistorical();
                $currentCaseStudy->save();
            }

            $semester = $this->currentSemesterQuery->execute();
            if ($semester === null) {
                throw new InvalidCaseStudy('O sistema não possui semestre atual cadastrado.');
            }

            $caseStudy = CaseStudy::register(
                student: $lockedStudent,
                semester: $semester,
                creatorId: (int) $creator->getKey(),
                version: $version,
                data: $this->dto($data),
            );
            $caseStudy->save();

            foreach ($data->barriers as $barrier) {
                $caseStudy->barriers()->save(new CaseStudyBarrier([
                    'type' => $barrier['type'],
                    'observed_situation' => $barrier['observed_situation'],
                    'participation_implication' => $barrier['participation_implication'],
                ]));
            }

            foreach ($data->strategies as $strategy) {
                $linkedBarrierId = null;
                if (isset($strategy['linked_barrier_index'])) {
                    $linkedBarrierId = $caseStudy->barriers()->get()->values()->get((int) $strategy['linked_barrier_index'])?->getKey();
                }
                $caseStudy->strategies()->save(new CaseStudyStrategy([
                    'linked_barrier_id' => $linkedBarrierId,
                    'description' => $strategy['description'],
                ]));
            }

            $caseStudy->contributions()->save(new CaseStudyContribution([
                'author_id' => (int) $creator->getKey(),
                'role' => CaseStudyContribution::CREATOR_ROLE,
                'content' => 'Estudo de Caso criado.',
                'created_at' => now(),
            ]));

            return $caseStudy->load(['student.person', 'semester', 'barriers', 'strategies', 'contributions.author']);
        });
    }

    private function dto(CreateCaseStudyData $data): CaseStudyDTO
    {
        return new CaseStudyDTO(
            demandOrigin: $data->demandOrigin,
            participantsSummary: $data->participantsSummary,
            studyDate: $data->studyDate,
            studentObservation: $data->studentObservation,
            studentFamilyListening: $data->studentFamilyListening,
            teachersListening: $data->teachersListening,
            otherInfo: $data->otherInfo,
            careNetworkNotes: $data->careNetworkNotes,
            favorableAspects: $data->favorableAspects,
            potentialsInterests: $data->potentialsInterests,
            neededSupports: $data->neededSupports,
            neededSupportsJustification: $data->neededSupportsJustification,
            acceptanceStatus: $data->acceptanceStatus,
            acceptanceDate: $data->acceptanceDate,
        );
    }
}

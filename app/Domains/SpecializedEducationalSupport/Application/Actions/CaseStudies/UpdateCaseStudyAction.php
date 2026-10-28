<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Actions\CaseStudies;

use App\Domains\SpecializedEducationalSupport\Application\Data\CaseStudies\UpdateCaseStudyData;
use App\Domains\SpecializedEducationalSupport\Domain\DTOs\CaseStudies\CaseStudyDTO;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudyBarrier;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudyStrategy;
use Illuminate\Support\Facades\DB;
use Throwable;

final class UpdateCaseStudyAction
{
    /** @throws Throwable */
    public function execute(CaseStudy $caseStudy, UpdateCaseStudyData $data): CaseStudy
    {
        return DB::transaction(function () use ($caseStudy, $data): CaseStudy {
            $lockedCaseStudy = CaseStudy::query()->lockForUpdate()->findOrFail($caseStudy->getKey());
            $lockedCaseStudy->revise($this->dto($data));
            $lockedCaseStudy->save();

            $lockedCaseStudy->strategies()->delete();
            $lockedCaseStudy->barriers()->delete();

            $barrierIndexToId = [];
            foreach ($data->barriers as $index => $barrier) {
                $created = $lockedCaseStudy->barriers()->save(new CaseStudyBarrier([
                    'type' => $barrier['type'],
                    'observed_situation' => $barrier['observed_situation'],
                    'participation_implication' => $barrier['participation_implication'],
                ]));
                $barrierIndexToId[$index] = $created->getKey();
            }

            foreach ($data->strategies as $strategy) {
                $linkedBarrierId = isset($strategy['linked_barrier_index'])
                    ? ($barrierIndexToId[(int) $strategy['linked_barrier_index']] ?? null)
                    : null;
                $lockedCaseStudy->strategies()->save(new CaseStudyStrategy([
                    'linked_barrier_id' => $linkedBarrierId,
                    'description' => $strategy['description'],
                ]));
            }

            return $lockedCaseStudy->load(['student.person', 'semester', 'barriers', 'strategies', 'contributions.author']);
        });
    }

    private function dto(UpdateCaseStudyData $data): CaseStudyDTO
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

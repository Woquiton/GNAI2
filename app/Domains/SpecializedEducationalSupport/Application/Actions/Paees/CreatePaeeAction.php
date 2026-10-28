<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Actions\Paees;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Application\Data\Paees\CreatePaeeData;
use App\Domains\SpecializedEducationalSupport\Application\Queries\Semesters\CurrentSemesterQuery;
use App\Domains\SpecializedEducationalSupport\Domain\DTOs\Paees\PaeeDTO;
use App\Domains\SpecializedEducationalSupport\Domain\Enums\StudentDocumentType;
use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidPaee;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Paee;
use App\Domains\SpecializedEducationalSupport\Domain\Models\PaeeObjective;
use App\Domains\SpecializedEducationalSupport\Domain\Models\PaeeResource;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreatePaeeAction
{
    public function __construct(
        private CurrentSemesterQuery $currentSemesterQuery,
    ) {}

    /**
     * @throws InvalidPaee
     * @throws Throwable
     */
    public function execute(CreatePaeeData $data, User $creator): Paee
    {
        return DB::transaction(function () use ($data, $creator): Paee {
            $caseStudy = CaseStudy::query()->lockForUpdate()->findOrFail($data->caseStudyId);
            $student = $caseStudy->student()->lockForUpdate()->first();

            $hasLaudo = $student->documents()
                ->where('type', StudentDocumentType::TECHNICAL_REPORT->value)
                ->exists();

            if ($caseStudy->status !== CaseStudy::STATUS_COMPLETED && !$hasLaudo) {
                throw new InvalidPaee('O PAEE só pode ser criado a partir de um Estudo de Caso concluído ou de um Laudo anexado ao aluno.');
            }

            $currentPaee = Paee::query()
                ->where('student_id', $student->getKey())
                ->where('is_current', true)
                ->lockForUpdate()
                ->first();

            $version = 1;
            if ($currentPaee instanceof Paee) {
                $version = ((int) $currentPaee->version) + 1;
                $currentPaee->markAsHistorical();
                $currentPaee->save();
            }

            $semester = $this->currentSemesterQuery->execute();
            if ($semester === null) {
                throw new InvalidPaee('O sistema não possui semestre atual cadastrado.');
            }

            $paee = Paee::register(
                caseStudy: $caseStudy,
                student: $student,
                semester: $semester,
                creatorId: (int) $creator->getKey(),
                version: $version,
                data: $this->dto($data),
            );
            $paee->save();

            foreach ($data->objectives as $objective) {
                $paee->objectives()->save(new PaeeObjective([
                    'linked_barrier_id' => $objective['linked_barrier_id'] ?? null,
                    'description' => $objective['description'],
                    'term' => $objective['term'],
                ]));
            }

            foreach ($data->resources as $resource) {
                $paee->resources()->save(new PaeeResource([
                    'description' => $resource['description'],
                    'acquisition_type' => $resource['acquisition_type'],
                    'assistive_technology_id' => $resource['assistive_technology_id'] ?? null,
                ]));
            }

            return $paee->load(['caseStudy', 'student.person', 'semester', 'objectives', 'resources']);
        });
    }

    private function dto(CreatePaeeData $data): PaeeDTO
    {
        return new PaeeDTO(
            attendanceFrequencyPerWeek: $data->attendanceFrequencyPerWeek,
            attendanceDurationMinutes: $data->attendanceDurationMinutes,
            attendanceFormat: $data->attendanceFormat,
            attendanceLocation: $data->attendanceLocation,
            assistiveTechnologyNeeded: $data->assistiveTechnologyNeeded,
            assistiveTechnologyNotes: $data->assistiveTechnologyNotes,
            assistiveTechnologyAvailabilityCapacity: $data->assistiveTechnologyAvailabilityCapacity,
            caaNeeded: $data->caaNeeded,
            caaNotes: $data->caaNotes,
            isAssistiveTechnologyPortableDigitalDevice: $data->isAssistiveTechnologyPortableDigitalDevice,
            assistiveTechnologyPedagogicalOpinion: $data->assistiveTechnologyPedagogicalOpinion,
            supportProfessionalNeeded: $data->supportProfessionalNeeded,
            supportProfessionalJustification: $data->supportProfessionalJustification,
            librasInterpreterNeeded: $data->librasInterpreterNeeded,
            librasInterpreterJustification: $data->librasInterpreterJustification,
            guideInterpreterNeeded: $data->guideInterpreterNeeded,
            guideInterpreterJustification: $data->guideInterpreterJustification,
            schoolProfessionalsOrientation: $data->schoolProfessionalsOrientation,
            commonTeachersArticulation: $data->commonTeachersArticulation,
            familyArticulation: $data->familyArticulation,
            intersectoralArticulation: $data->intersectoralArticulation,
            trainingDemands: $data->trainingDemands,
        );
    }
}

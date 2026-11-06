<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Paees;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Application\Data\Paees\UpdatePaeeData;
use App\Domains\Domain\DTOs\Paees\PaeeDTO;
use App\Domains\Domain\Models\Paees\Paee;
use App\Domains\Domain\Models\Paees\PaeeObjective;
use App\Domains\Domain\Models\Paees\PaeeResource;
use Illuminate\Support\Facades\DB;
use Throwable;

final class UpdatePaeeAction
{
    private const REVISABLE_FIELDS = [
        'attendance_frequency_per_week' => 'Frequência de atendimento',
        'attendance_duration_minutes' => 'Duração do atendimento',
        'attendance_format' => 'Formato de atendimento',
        'attendance_location' => 'Local de atendimento',
        'assistive_technology_needed' => 'Necessidade de tecnologia assistiva',
        'assistive_technology_notes' => 'Notas sobre tecnologia assistiva',
        'assistive_technology_availability_capacity' => 'Capacidade de disponibilização de TA',
        'caa_needed' => 'Necessidade de CAA',
        'caa_notes' => 'Notas sobre CAA',
        'is_assistive_technology_portable_digital_device' => 'TA como dispositivo digital portátil',
        'assistive_technology_pedagogical_opinion' => 'Parecer pedagógico sobre a TA',
        'support_professional_needed' => 'Necessidade de profissional de apoio',
        'support_professional_justification' => 'Justificativa do profissional de apoio',
        'libras_interpreter_needed' => 'Necessidade de intérprete de Libras',
        'libras_interpreter_justification' => 'Justificativa do intérprete de Libras',
        'guide_interpreter_needed' => 'Necessidade de guia-intérprete',
        'guide_interpreter_justification' => 'Justificativa do guia-intérprete',
        'school_professionals_orientation' => 'Orientações aos profissionais da escola',
        'common_teachers_articulation' => 'Articulação com professores comuns',
        'family_articulation' => 'Articulação com a família',
        'intersectoral_articulation' => 'Articulação intersetorial',
        'training_demands' => 'Demandas de formação',
    ];

    /** @throws Throwable */
    public function execute(Paee $paee, UpdatePaeeData $data, User $user): Paee
    {
        return DB::transaction(function () use ($paee, $data, $user): Paee {
            $lockedPaee = Paee::query()->lockForUpdate()->findOrFail($paee->getKey());
            $lockedPaee->student()->lockForUpdate()->firstOrFail()->ensureNotInIntake();
            $before = $lockedPaee->only(array_keys(self::REVISABLE_FIELDS));

            $lockedPaee->revise($this->dto($data));
            $lockedPaee->save();

            $changedFieldsWithLabels = collect(self::REVISABLE_FIELDS)
                ->filter(fn (string $label, string $field): bool => $before[$field] !== $lockedPaee->{$field});

            if ($changedFieldsWithLabels->isNotEmpty()) {
                $lockedPaee->reviews()->create([
                    'reviewed_at' => now()->toDateString(),
                    'what_changed' => 'Campo(s) alterado(s): '.$changedFieldsWithLabels->values()->implode(', ').'.',
                    'why' => 'Revisão registrada automaticamente ao salvar a edição do PAEE.',
                    'reviewer_id' => (int) $user->getKey(),
                ]);
            }

            // Um a um, para a auditoria registrar cada exclusão.
            $lockedPaee->objectives()->get()->each->delete();
            $lockedPaee->resources()->get()->each->delete();

            foreach ($data->objectives as $objective) {
                $lockedPaee->objectives()->save(new PaeeObjective([
                    'linked_barrier_id' => $objective['linked_barrier_id'] ?? null,
                    'description' => $objective['description'],
                    'term' => $objective['term'],
                ]));
            }

            foreach ($data->resources as $resource) {
                $lockedPaee->resources()->save(new PaeeResource([
                    'description' => $resource['description'],
                    'acquisition_type' => $resource['acquisition_type'],
                    'assistive_technology_id' => $resource['assistive_technology_id'] ?? null,
                ]));
            }

            return $lockedPaee->load(['caseStudy', 'student.person', 'semester', 'objectives', 'resources']);
        });
    }

    private function dto(UpdatePaeeData $data): PaeeDTO
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

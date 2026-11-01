<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Data\Paees;

use App\Domains\Inclusion\Domain\Enums\ItemType;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Support\Validation\ValidationContext;

#[MapInputName(SnakeCaseMapper::class)]
final class CreatePaeeData extends Data
{
    public function __construct(
        public int $caseStudyId,
        public int $attendanceFrequencyPerWeek,
        public int $attendanceDurationMinutes,
        public string $attendanceFormat,
        public string $attendanceLocation,
        public bool $assistiveTechnologyNeeded,
        public ?string $assistiveTechnologyNotes,
        public ?string $assistiveTechnologyAvailabilityCapacity,
        public bool $caaNeeded,
        public ?string $caaNotes,
        public bool $isAssistiveTechnologyPortableDigitalDevice,
        public ?string $assistiveTechnologyPedagogicalOpinion,
        public bool $supportProfessionalNeeded,
        public ?string $supportProfessionalJustification,
        public bool $librasInterpreterNeeded,
        public ?string $librasInterpreterJustification,
        public bool $guideInterpreterNeeded,
        public ?string $guideInterpreterJustification,
        public ?string $schoolProfessionalsOrientation,
        public ?string $commonTeachersArticulation,
        public ?string $familyArticulation,
        public ?string $intersectoralArticulation,
        public ?string $trainingDemands,
        public array $objectives = [],
        public array $resources = [],
    ) {}

    public static function prepareForPipeline(array $properties): array
    {
        foreach ([
            'assistive_technology_needed',
            'caa_needed',
            'is_assistive_technology_portable_digital_device',
            'support_professional_needed',
            'libras_interpreter_needed',
            'guide_interpreter_needed',
        ] as $field) {
            $properties[$field] = filter_var($properties[$field] ?? false, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        }

        return $properties;
    }

    public static function rules(ValidationContext $context): array
    {
        $caseStudyId = (int) ($context->fullPayload['case_study_id'] ?? 0);

        return [
            'case_study_id' => ['required', 'integer', 'exists:case_studies,id'],
            'attendance_frequency_per_week' => ['required', 'integer', 'min:1', 'max:7'],
            'attendance_duration_minutes' => ['required', 'integer', 'min:1'],
            'attendance_format' => ['required', 'string', 'in:individual,collective,mixed'],
            'attendance_location' => ['required', 'string', 'in:srm,common_classroom,accessibility_center,other'],

            'assistive_technology_needed' => ['required', 'boolean'],
            'assistive_technology_notes' => ['required_if:assistive_technology_needed,1', 'nullable', 'string'],
            'assistive_technology_availability_capacity' => ['nullable', 'string'],
            'caa_needed' => ['required', 'boolean'],
            'caa_notes' => ['required_if:caa_needed,1', 'nullable', 'string'],
            'is_assistive_technology_portable_digital_device' => ['required', 'boolean'],
            'assistive_technology_pedagogical_opinion' => ['required_if:is_assistive_technology_portable_digital_device,1', 'nullable', 'string'],

            'support_professional_needed' => ['required', 'boolean'],
            'support_professional_justification' => ['required_if:support_professional_needed,1', 'nullable', 'string'],
            'libras_interpreter_needed' => ['required', 'boolean'],
            'libras_interpreter_justification' => ['required_if:libras_interpreter_needed,1', 'nullable', 'string'],
            'guide_interpreter_needed' => ['required', 'boolean'],
            'guide_interpreter_justification' => ['required_if:guide_interpreter_needed,1', 'nullable', 'string'],

            'school_professionals_orientation' => ['nullable', 'string'],
            'common_teachers_articulation' => ['nullable', 'string'],
            'family_articulation' => ['nullable', 'string'],
            'intersectoral_articulation' => ['nullable', 'string'],
            'training_demands' => ['nullable', 'string'],
            'objectives' => ['nullable', 'array'],
            'objectives.*.description' => ['required_with:objectives', 'string', 'max:100000'],
            'objectives.*.term' => ['required_with:objectives', 'string', 'in:short,medium,long'],
            // Só barreiras do Estudo de Caso que fundamenta este PAEE.
            'objectives.*.linked_barrier_id' => [
                'nullable',
                'integer',
                Rule::exists('case_study_barriers', 'id')->where('case_study_id', $caseStudyId),
            ],
            'resources' => ['nullable', 'array'],
            'resources.*.description' => ['required_with:resources', 'string', 'max:100000'],
            'resources.*.acquisition_type' => ['required_with:resources', 'string', 'in:to_produce,to_accessibilize,to_acquire'],
            'resources.*.assistive_technology_id' => [
                'nullable',
                'integer',
                Rule::exists('items', 'id')->where('item_type', ItemType::AssistiveTechnology->value),
            ],
        ];
    }

    public static function attributes(): array
    {
        return [
            'assistive_technology_notes' => 'observações sobre tecnologia assistiva',
            'caa_notes' => 'observações sobre CAA',
            'assistive_technology_availability_capacity' => 'capacidade de disponibilização da TA',
            'assistive_technology_pedagogical_opinion' => 'parecer pedagógico sobre a TA portátil',
            'support_professional_justification' => 'justificativa do profissional de apoio',
            'libras_interpreter_justification' => 'justificativa do intérprete de Libras',
            'guide_interpreter_justification' => 'justificativa do guia-intérprete',
            'school_professionals_orientation' => 'orientação aos profissionais da escola',
            'common_teachers_articulation' => 'articulação com professores do ensino comum',
            'family_articulation' => 'envolvimento da família',
            'intersectoral_articulation' => 'articulação intersetorial',
            'training_demands' => 'demandas de formação',
            'attendance_frequency_per_week' => 'frequência semanal',
            'attendance_duration_minutes' => 'duração do atendimento',
            'attendance_format' => 'formato do atendimento',
            'attendance_location' => 'local do atendimento',
            'assistive_technology_needed' => 'necessidade de tecnologia assistiva',
            'caa_needed' => 'necessidade de CAA',
            'is_assistive_technology_portable_digital_device' => 'tecnologia assistiva portátil',
            'support_professional_needed' => 'necessidade de profissional de apoio',
            'libras_interpreter_needed' => 'necessidade de intérprete de Libras',
            'guide_interpreter_needed' => 'necessidade de guia-intérprete',
            'case_study_id' => 'estudo de caso',
            'objectives' => 'objetivos',
            'objectives.*.description' => 'descrição do objetivo',
            'objectives.*.term' => 'prazo do objetivo',
            'objectives.*.linked_barrier_id' => 'barreira vinculada',
            'resources' => 'recursos',
            'resources.*.description' => 'descrição do recurso',
            'resources.*.acquisition_type' => 'tipo de aquisição',
            'resources.*.assistive_technology_id' => 'tecnologia assistiva',
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Data\Paees\Concerns;

trait HasPaeeValidation
{
    protected static function contentRules(): array
    {
        return [
            'attendance_frequency_per_week' => ['required', 'integer', 'min:1', 'max:7'],
            'attendance_duration_minutes' => ['required', 'integer', 'min:1'],
            'attendance_format' => ['required', 'string', 'in:individual,collective,mixed'],
            'attendance_location' => ['required', 'string', 'in:srm,common_classroom,accessibility_center,other'],

            'assistive_technology_needed' => ['required', 'boolean'],
            'assistive_technology_notes' => ['required_if:assistive_technology_needed,1', 'nullable', 'string', 'max:100000'],
            'assistive_technology_availability_capacity' => ['nullable', 'string', 'max:100000'],
            'caa_needed' => ['required', 'boolean'],
            'caa_notes' => ['required_if:caa_needed,1', 'nullable', 'string', 'max:100000'],
            'is_assistive_technology_portable_digital_device' => ['required', 'boolean'],
            'assistive_technology_pedagogical_opinion' => ['required_if:is_assistive_technology_portable_digital_device,1', 'nullable', 'string', 'max:100000'],

            'support_professional_needed' => ['required', 'boolean'],
            'support_professional_justification' => ['required_if:support_professional_needed,1', 'nullable', 'string', 'max:100000'],
            'libras_interpreter_needed' => ['required', 'boolean'],
            'libras_interpreter_justification' => ['required_if:libras_interpreter_needed,1', 'nullable', 'string', 'max:100000'],
            'guide_interpreter_needed' => ['required', 'boolean'],
            'guide_interpreter_justification' => ['required_if:guide_interpreter_needed,1', 'nullable', 'string', 'max:100000'],

            'school_professionals_orientation' => ['nullable', 'string', 'max:100000'],
            'common_teachers_articulation' => ['nullable', 'string', 'max:100000'],
            'family_articulation' => ['nullable', 'string', 'max:100000'],
            'intersectoral_articulation' => ['nullable', 'string', 'max:100000'],
            'training_demands' => ['nullable', 'string', 'max:100000'],
            'objectives' => ['nullable', 'array'],
            'objectives.*.description' => ['required_with:objectives', 'string', 'max:100000'],
            'objectives.*.term' => ['required_with:objectives', 'string', 'in:short,medium,long'],
            'objectives.*.linked_barrier_id' => ['nullable', 'integer', 'exists:case_study_barriers,id'],
            'resources' => ['nullable', 'array'],
            'resources.*.description' => ['required_with:resources', 'string', 'max:100000'],
            'resources.*.acquisition_type' => ['required_with:resources', 'string', 'in:to_produce,to_accessibilize,to_acquire'],
            'resources.*.assistive_technology_id' => ['nullable', 'integer', 'exists:assistive_technologies,id'],
        ];
    }

    protected static function preparePresence(array $properties): array
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
}

<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Data\CaseStudies\Concerns;

trait HasCaseStudyValidation
{
    protected static function contentRules(): array
    {
        return [
            'demand_origin' => ['required', 'string', 'in:teacher,family,student,medical_report,other'],
            'participants_summary' => ['nullable', 'string', 'max:100000'],
            'study_date' => ['nullable', 'date'],
            'student_observation' => ['required', 'string', 'max:100000'],
            'student_family_listening' => ['required', 'string', 'max:100000'],
            'teachers_listening' => ['required', 'string', 'max:100000'],
            'other_info' => ['nullable', 'string', 'max:100000'],
            'care_network_notes' => ['nullable', 'string', 'max:100000'],
            'favorable_aspects' => ['required', 'string', 'max:100000'],
            'potentials_interests' => ['required', 'string', 'max:100000'],
            'needed_supports' => ['required', 'array', 'min:1'],
            'needed_supports.*' => ['string', 'in:locomotion,hygiene,feeding,communication,interaction,assistive_technology,libras,guide_interpreter,orientation_mobility,none'],
            'needed_supports_justification' => ['nullable', 'string', 'max:100000'],
            'acceptance_status' => ['required', 'string', 'in:accepted,declined,not_applicable'],
            'acceptance_date' => ['nullable', 'date'],
            'barriers' => ['nullable', 'array'],
            'barriers.*.type' => ['required_with:barriers', 'string', 'in:architectural,urbanistic,transport,communicational,methodological,technological,attitudinal,social'],
            'barriers.*.observed_situation' => ['required_with:barriers', 'string', 'max:100000'],
            'barriers.*.participation_implication' => ['required_with:barriers', 'string', 'max:100000'],
            'strategies' => ['nullable', 'array'],
            'strategies.*.description' => ['required_with:strategies', 'string', 'max:100000'],
            'strategies.*.linked_barrier_index' => ['nullable', 'integer'],
        ];
    }
}

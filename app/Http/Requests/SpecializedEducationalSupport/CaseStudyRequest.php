<?php

namespace App\Http\Requests\SpecializedEducationalSupport;

use App\Enums\SpecializedEducationalSupport\AcceptanceStatus;
use App\Enums\SpecializedEducationalSupport\DemandOrigin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CaseStudyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'demand_origin' => ['required', Rule::enum(DemandOrigin::class)],
            'participants_summary' => ['nullable', 'string'],
            'student_observation' => ['required', 'string'],
            'student_family_listening' => ['required', 'string'],
            'teachers_listening' => ['required', 'string'],
            'other_info' => ['nullable', 'string'],
            'care_network_notes' => ['nullable', 'string'],
            'favorable_aspects' => ['required', 'string'],
            'potentials_interests' => ['required', 'string'],

            'needed_supports' => ['required', 'array', 'min:1'],
            'needed_supports.*' => [
                'string',
                Rule::in([
                    'locomotion',
                    'hygiene',
                    'feeding',
                    'communication',
                    'interaction',
                    'assistive_technology',
                    'libras',
                    'guide_interpreter',
                    'orientation_mobility',
                    'none',
                ]),
            ],
            'needed_supports_justification' => ['nullable', 'string'],

            'acceptance_status' => ['required', Rule::enum(AcceptanceStatus::class)],
            'acceptance_date' => ['nullable', 'date'],

            'barriers' => ['nullable', 'array'],
            'barriers.*.type' => ['required_with:barriers', 'string'],
            'barriers.*.observed_situation' => ['required_with:barriers', 'string'],
            'barriers.*.participation_implication' => ['required_with:barriers', 'string'],

            'strategies' => ['nullable', 'array'],
            'strategies.*.description' => ['required_with:strategies', 'string'],
            'strategies.*.linked_barrier_index' => ['nullable', 'integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'demand_origin.required' => 'Informe a origem da demanda.',
            'student_observation.required' => 'A observação do(a) estudante é obrigatória.',
            'student_family_listening.required' => 'O registro da escuta do(a) estudante/família é obrigatório.',
            'teachers_listening.required' => 'O registro da escuta dos(as) professores(as) é obrigatório.',
            'favorable_aspects.required' => 'Informe os aspectos favoráveis identificados.',
            'potentials_interests.required' => 'Informe as potencialidades e interesses do(a) estudante.',
            'needed_supports.required' => 'Selecione ao menos um tipo de apoio necessário.',
            'needed_supports.min' => 'Selecione ao menos um tipo de apoio necessário.',
            'acceptance_status.required' => 'Informe a situação do aceite.',
        ];
    }
}

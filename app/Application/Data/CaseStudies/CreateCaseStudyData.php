<?php

declare(strict_types=1);

namespace App\Application\Data\CaseStudies;

use App\Application\Queries\CaseStudies\CaseStudyBarrierOptionsQuery;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class CreateCaseStudyData extends Data
{
    public function __construct(
        public string $demandOrigin,
        public ?string $participantsSummary,
        public ?string $studyDate,
        public string $studentObservation,
        public string $studentFamilyListening,
        public string $teachersListening,
        public ?string $otherInfo,
        public ?string $careNetworkNotes,
        public string $favorableAspects,
        public string $potentialsInterests,
        public array $neededSupports,
        public ?string $neededSupportsJustification,
        public string $acceptanceStatus,
        public ?string $acceptanceDate,
        public array $barriers = [],
        public array $strategies = [],
    ) {}

    public static function rules(): array
    {
        return [
            'demand_origin' => ['required', 'string', 'in:teacher,family,student,medical_report,other'],
            'participants_summary' => ['nullable', 'string'],
            'study_date' => ['nullable', 'date'],
            'student_observation' => ['required', 'string'],
            'student_family_listening' => ['required', 'string'],
            'teachers_listening' => ['required', 'string'],
            'other_info' => ['nullable', 'string'],
            'care_network_notes' => ['nullable', 'string'],
            'favorable_aspects' => ['required', 'string'],
            'potentials_interests' => ['required', 'string'],
            'needed_supports' => ['required', 'array', 'min:1'],
            'needed_supports.*' => ['string', 'in:locomotion,hygiene,feeding,communication,interaction,assistive_technology,libras,guide_interpreter,orientation_mobility,none'],
            'needed_supports_justification' => ['nullable', 'string'],
            'acceptance_status' => ['required', 'string', 'in:accepted,declined,not_applicable'],
            'acceptance_date' => ['nullable', 'date'],
            'barriers' => ['nullable', 'array'],
            'barriers.*.type' => [
                'required_with:barriers',
                'string',
                'max:255',
                Rule::in(array_keys(app(CaseStudyBarrierOptionsQuery::class)->execute())),
            ],
            'barriers.*.observed_situation' => ['required_with:barriers', 'string', 'max:100000'],
            'barriers.*.participation_implication' => ['required_with:barriers', 'string', 'max:100000'],
            'strategies' => ['nullable', 'array'],
            'strategies.*.description' => ['required_with:strategies', 'string', 'max:100000'],
            'strategies.*.linked_barrier_index' => ['nullable', 'integer'],
        ];
    }

    public static function attributes(): array
    {
        return [
            'demand_origin' => 'origem da demanda',
            'participants_summary' => 'participantes (resumo)',
            'study_date' => 'data do Estudo de Caso',
            'student_observation' => 'observação do estudante',
            'student_family_listening' => 'escuta do estudante/família',
            'teachers_listening' => 'escuta dos professores',
            'other_info' => 'outras informações',
            'care_network_notes' => 'observações da rede de cuidado',
            'favorable_aspects' => 'aspectos favoráveis',
            'potentials_interests' => 'potenciais e interesses',
            'needed_supports' => 'apoios necessários',
            'needed_supports.*' => 'apoio necessário',
            'needed_supports_justification' => 'justificativa dos apoios necessários',
            'acceptance_status' => 'status de aceite',
            'acceptance_date' => 'data do aceite',
            'barriers' => 'barreiras',
            'barriers.*.type' => 'categoria de barreira',
            'barriers.*.observed_situation' => 'situação observada',
            'barriers.*.participation_implication' => 'implicação na participação',
            'strategies' => 'estratégias',
            'strategies.*.description' => 'descrição da estratégia',
            'strategies.*.linked_barrier_index' => 'barreira relacionada',
        ];
    }

    public static function messages(): array
    {
        return [
            'required' => 'Preencha o campo :attribute.',
            'required_with' => 'Preencha o campo :attribute.',
            'string' => 'O campo :attribute deve ser um texto.',
            'array' => 'O campo :attribute deve ser uma lista.',
            'integer' => 'O campo :attribute deve ser um número inteiro.',
            'date' => 'Informe uma data válida em :attribute.',
            'in' => 'Selecione uma opção válida em :attribute.',
            'max.string' => 'O campo :attribute deve ter no máximo :max caracteres.',
            'needed_supports.required' => 'Selecione pelo menos um apoio necessário.',
            'needed_supports.min' => 'Selecione pelo menos um apoio necessário.',
            'barriers.*.type.in' => 'Selecione uma categoria de barreira disponível no cadastro.',
        ];
    }
}

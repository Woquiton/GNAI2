<?php

declare(strict_types=1);

namespace App\Application\Data\PeiDisciplines;

use App\Domain\Models\PeiDiscipline;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class UpdatePeiDisciplineData extends Data
{
    public function __construct(
        public int $teacherId,
        public int $disciplineId,
        public string $specificObjectives,
        public string $contentProgrammatic,
        public string $methodologies,
        public string $evaluations,
        public ?string $opinion = null,
        public ?string $complementaryRecords = null,
        public ?string $curricularReference = null,
        public ?string $materialsAndAssistiveTechnology = null,
        public ?string $objectivesDeadline = null,
    ) {}

    public static function prepareForPipeline(array $properties): array
    {
        if (request()->routeIs('teacher-portal.discipline.update')) {
            $peiDiscipline = request()->route('peiDiscipline');

            abort_unless($peiDiscipline instanceof PeiDiscipline, 404);

            // No portal, o professor edita o conteúdo, preservando o vínculo
            // cadastrado mesmo se outros IDs forem enviados na requisição.
            $properties['teacher_id'] = $peiDiscipline->teacher_id;
            $properties['discipline_id'] = $peiDiscipline->discipline_id;
        }

        return $properties;
    }

    public static function rules(): array
    {
        return [
            'teacher_id' => ['required', 'integer', Rule::exists('teachers', 'id')],
            'discipline_id' => ['required', 'integer', Rule::exists('disciplines', 'id')],
            'specific_objectives' => ['required', 'string'],
            'content_programmatic' => ['required', 'string'],
            'methodologies' => ['required', 'string'],
            'evaluations' => ['required', 'string'],
            'opinion' => ['nullable', 'string'],
            'complementary_records' => ['nullable', 'string'],
            'curricular_reference' => ['nullable', 'string'],
            'materials_and_assistive_technology' => ['nullable', 'string'],
            'objectives_deadline' => ['nullable', 'string', 'max:255'],
        ];
    }

    public static function messages(): array
    {
        return [
            'teacher_id.required' => 'O professor responsável é obrigatório.',
            'teacher_id.integer' => 'O professor responsável informado é inválido.',
            'teacher_id.exists' => 'O professor responsável informado é inválido.',
            'discipline_id.required' => 'A disciplina é obrigatória.',
            'discipline_id.integer' => 'A disciplina informada é inválida.',
            'discipline_id.exists' => 'A disciplina informada é inválida.',
            'specific_objectives.required' => 'Os objetivos específicos são obrigatórios.',
            'specific_objectives.string' => 'Os objetivos específicos devem ser um texto válido.',
            'content_programmatic.required' => 'O conteúdo programático é obrigatório.',
            'content_programmatic.string' => 'O conteúdo programático deve ser um texto válido.',
            'methodologies.required' => 'As metodologias e estratégias são obrigatórias.',
            'methodologies.string' => 'As metodologias e estratégias devem ser um texto válido.',
            'evaluations.required' => 'O processo de avaliação é obrigatório.',
            'evaluations.string' => 'O processo de avaliação deve ser um texto válido.',
            'opinion.string' => 'O parecer deve ser um texto válido.',
            'complementary_records.string' => 'Os registros complementares devem ser um texto válido.',
        ];
    }
}

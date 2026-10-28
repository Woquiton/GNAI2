<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Actions\PeiDisciplines;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Application\Data\PeiDisciplines\BulkAssignPeiDisciplinesData;
use App\Domains\SpecializedEducationalSupport\Application\Data\PeiDisciplines\CreatePeiDisciplineData;
use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidPeiDiscipline;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Pei;
use App\Domains\SpecializedEducationalSupport\Domain\Models\PeiDiscipline;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class BulkAssignPeiDisciplinesAction
{
    public function __construct(
        private CreatePeiDisciplineAction $createPeiDisciplineAction,
    ) {}

    /**
     * Organiza de uma vez a identificação (disciplina + professor) de todas
     * as adaptações do PEI. O conteúdo pedagógico (objetivos, metodologias
     * etc.) começa com um texto provisório e é preenchido depois, disciplina
     * por disciplina, pelo professor responsável ou pela equipe do AEE.
     *
     * @return array{created: int, skipped: list<string>}
     *
     * @throws Throwable
     */
    public function execute(Pei $pei, User $creator, BulkAssignPeiDisciplinesData $data): array
    {
        return DB::transaction(function () use ($pei, $creator, $data): array {
            $created = 0;
            $skipped = [];

            foreach ($data->assignments as $assignment) {
                $createData = new CreatePeiDisciplineData(
                    teacherId: (int) $assignment['teacher_id'],
                    disciplineId: (int) $assignment['discipline_id'],
                    specificObjectives: PeiDiscipline::PLACEHOLDER_TEXT,
                    contentProgrammatic: PeiDiscipline::PLACEHOLDER_TEXT,
                    methodologies: PeiDiscipline::PLACEHOLDER_TEXT,
                    evaluations: PeiDiscipline::PLACEHOLDER_TEXT,
                );

                try {
                    $this->createPeiDisciplineAction->execute($pei, $creator, $createData);
                    $created++;
                } catch (InvalidPeiDiscipline $exception) {
                    $skipped[] = $exception->getMessage();
                }
            }

            return ['created' => $created, 'skipped' => $skipped];
        });
    }
}

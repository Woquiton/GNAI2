<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Actions\Deficiencies;

use App\Domains\Inclusion\Application\Data\Deficiencies\UpdateDeficiencyData;
use App\Domains\Inclusion\Application\Queries\Deficiencies\DeficiencyHasStudentsQuery;
use App\Domains\Inclusion\Domain\DTOs\Deficiencies\UpdateDeficiencyDTO;
use App\Domains\Inclusion\Domain\Models\Deficiency;
use Illuminate\Support\Facades\DB;

final readonly class UpdateDeficiencyAction
{
    public function __construct(
        private DeficiencyHasStudentsQuery $hasStudents,
    ) {}

    public function execute(Deficiency $deficiency, UpdateDeficiencyData $data): Deficiency
    {
        return DB::transaction(function () use ($deficiency, $data): Deficiency {
            $lockedDeficiency = Deficiency::query()
                ->lockForUpdate()
                ->findOrFail($deficiency->getKey());

            if ($data->isActive !== null && $data->isActive !== $lockedDeficiency->is_active) {
                if ($data->isActive) {
                    $lockedDeficiency->activate();
                } else {
                    $lockedDeficiency->ensureCanBeDeactivated(
                        $this->hasStudents->execute($lockedDeficiency),
                    );
                    $lockedDeficiency->deactivate();
                }
            }

            $lockedDeficiency->revise(new UpdateDeficiencyDTO(
                name: $data->name,
                cidCode: $data->cidCode,
                description: $data->description,
            ));
            $lockedDeficiency->save();

            return $lockedDeficiency;
        });
    }
}

<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Deficiencies;

use App\Domains\Application\Queries\Deficiencies\DeficiencyHasStudentsQuery;
use App\Domains\Domain\Models\Deficiencies\Deficiency;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class ToggleDeficiencyActiveAction
{
    public function __construct(
        private DeficiencyHasStudentsQuery $hasStudents,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Deficiency $deficiency): Deficiency
    {
        return DB::transaction(function () use ($deficiency): Deficiency {
            $lockedDeficiency = Deficiency::query()
                ->lockForUpdate()
                ->findOrFail($deficiency->getKey());

            if ($lockedDeficiency->is_active) {
                $lockedDeficiency->ensureCanBeDeactivated(
                    $this->hasStudents->execute($lockedDeficiency),
                );
                $lockedDeficiency->deactivate();
            } else {
                $lockedDeficiency->activate();
            }

            $lockedDeficiency->save();

            return $lockedDeficiency;
        });
    }
}

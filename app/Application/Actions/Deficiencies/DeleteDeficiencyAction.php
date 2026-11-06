<?php

declare(strict_types=1);

namespace App\Application\Actions\Deficiencies;

use App\Application\Queries\Deficiencies\DeficiencyHasStudentsQuery;
use App\Domain\Models\Deficiency;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteDeficiencyAction
{
    public function __construct(
        private DeficiencyHasStudentsQuery $hasStudents,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Deficiency $deficiency): void
    {
        DB::transaction(function () use ($deficiency): void {
            $lockedDeficiency = Deficiency::query()
                ->lockForUpdate()
                ->findOrFail($deficiency->getKey());

            $lockedDeficiency->ensureCanBeDeactivated(
                $this->hasStudents->execute($lockedDeficiency),
            );

            $lockedDeficiency->ensureCanBeDeleted($lockedDeficiency->supportRequests()->exists());

            $lockedDeficiency->delete();
        });
    }
}

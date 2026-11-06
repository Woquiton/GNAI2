<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Institutions;

use App\Domains\Application\Queries\Institutions\InstitutionHasActiveBarriersQuery;
use App\Domains\Domain\Exceptions\Institutions\InvalidInstitution;
use App\Domains\Domain\Models\Institutions\Institution;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteInstitutionAction
{
    public function __construct(
        private InstitutionHasActiveBarriersQuery $hasActiveBarriers,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Institution $institution): void
    {
        DB::transaction(function () use ($institution): void {
            $lockedInstitution = Institution::query()
                ->lockForUpdate()
                ->findOrFail($institution->getKey());

            if ($this->hasActiveBarriers->execute($lockedInstitution)) {
                throw new InvalidInstitution(
                    'Não é possível excluir esta instituição pois ela possui barreiras ativas.'
                );
            }

            $lockedInstitution->deleteLocations();
            $lockedInstitution->delete();
        });
    }
}

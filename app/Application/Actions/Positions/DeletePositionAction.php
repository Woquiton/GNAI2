<?php

declare(strict_types=1);

namespace App\Application\Actions\Positions;

use App\Application\Queries\Positions\PositionHasProfessionalsQuery;
use App\Domain\Models\Position;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeletePositionAction
{
    public function __construct(
        private PositionHasProfessionalsQuery $hasProfessionals,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Position $position): void
    {
        DB::transaction(function () use ($position): void {
            $lockedPosition = Position::query()
                ->lockForUpdate()
                ->findOrFail($position->getKey());

            $lockedPosition->ensureCanBeDeleted(
                $this->hasProfessionals->execute($lockedPosition),
            );

            $lockedPosition->delete();
        });
    }
}

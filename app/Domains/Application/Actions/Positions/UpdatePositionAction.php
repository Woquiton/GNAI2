<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Positions;

use App\Domains\Application\Permissions\Auth\PermissionCache;
use App\Domains\Application\Data\Positions\UpdatePositionData;
use App\Domains\Application\Queries\Positions\PositionHasProfessionalsQuery;
use App\Domains\Domain\DTOs\Positions\UpdatePositionDTO;
use App\Domains\Domain\Models\Positions\Position;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdatePositionAction
{
    public function __construct(
        private PermissionCache $permissionCache,
        private PositionHasProfessionalsQuery $hasProfessionals,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Position $position, UpdatePositionData $data): Position
    {
        return DB::transaction(function () use ($position, $data): Position {
            $lockedPosition = Position::query()
                ->lockForUpdate()
                ->findOrFail($position->getKey());

            if ($data->isActive !== null && $data->isActive !== $lockedPosition->is_active) {
                if ($data->isActive) {
                    $lockedPosition->activate();
                } else {
                    $lockedPosition->ensureCanBeDeactivated(
                        $this->hasProfessionals->execute($lockedPosition),
                    );
                    $lockedPosition->deactivate();
                }
            }

            $positionDTO = new UpdatePositionDTO(
                name: $data->name,
                description: $data->description,
            );

            $lockedPosition->revise($positionDTO);
            $lockedPosition->save();
            $lockedPosition->assignPermissions($data->permissions);
            $this->permissionCache->invalidate();

            return $lockedPosition->load('permissions');
        });
    }
}

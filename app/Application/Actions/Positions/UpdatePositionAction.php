<?php

declare(strict_types=1);

namespace App\Application\Actions\Positions;

use App\Domains\Auth\Application\Permissions\PermissionCache;
use App\Application\Data\Positions\UpdatePositionData;
use App\Application\Queries\Positions\PositionHasProfessionalsQuery;
use App\Domain\DTOs\Positions\UpdatePositionDTO;
use App\Domain\Models\Position;
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

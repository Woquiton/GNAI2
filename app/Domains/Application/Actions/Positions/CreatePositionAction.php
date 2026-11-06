<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Positions;

use App\Domains\Application\Permissions\Auth\PermissionCache;
use App\Domains\Application\Data\Positions\CreatePositionData;
use App\Domains\Domain\DTOs\Positions\CreatePositionDTO;
use App\Domains\Domain\Models\Positions\Position;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreatePositionAction
{
    public function __construct(
        private PermissionCache $permissionCache,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(CreatePositionData $data): Position
    {
        return DB::transaction(function () use ($data): Position {
            $positionDTO = new CreatePositionDTO(
                name: $data->name,
                description: $data->description,
                isActive: $data->isActive,
            );

            $position = Position::register($positionDTO);
            $position->save();
            $position->assignPermissions($data->permissions);
            $this->permissionCache->invalidate();

            return $position->load('permissions');
        });
    }
}

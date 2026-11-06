<?php

declare(strict_types=1);

namespace App\Application\Actions\Deficiencies;

use App\Application\Data\Deficiencies\CreateDeficiencyData;
use App\Domain\DTOs\Deficiencies\CreateDeficiencyDTO;
use App\Domain\Models\Deficiency;

final readonly class CreateDeficiencyAction
{
    public function execute(CreateDeficiencyData $data): Deficiency
    {
        $deficiencyDTO = new CreateDeficiencyDTO(
            name: $data->name,
            cidCode: $data->cidCode,
            description: $data->description,
            isActive: $data->isActive,
        );

        $deficiency = Deficiency::register($deficiencyDTO);
        $deficiency->save();

        return $deficiency;
    }
}

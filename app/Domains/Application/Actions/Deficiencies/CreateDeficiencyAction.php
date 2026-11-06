<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Deficiencies;

use App\Domains\Application\Data\Deficiencies\CreateDeficiencyData;
use App\Domains\Domain\DTOs\Deficiencies\CreateDeficiencyDTO;
use App\Domains\Domain\Models\Deficiencies\Deficiency;

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

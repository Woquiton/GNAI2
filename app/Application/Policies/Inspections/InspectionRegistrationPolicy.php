<?php

declare(strict_types=1);

namespace App\Application\Policies\Inspections;

use App\Application\Data\Inspections\CreateInspectionData;

final readonly class InspectionRegistrationPolicy
{
    public function shouldRegister(
        bool $stateChanged,
        CreateInspectionData $inspection,
    ): bool {
        return $stateChanged
            || filled($inspection->description)
            || $inspection->evidences !== [];
    }
}

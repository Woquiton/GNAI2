<?php

declare(strict_types=1);

namespace App\Domain\DTOs\Guardians;

use App\Domain\Enums\GuardianRelationship;

final readonly class UpdateGuardianDTO
{
    public function __construct(
        public GuardianRelationship $relationship,
    ) {}
}

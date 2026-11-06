<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Guardians;

use App\Domains\Domain\Enums\Guardians\GuardianRelationship;

final readonly class UpdateGuardianDTO
{
    public function __construct(
        public GuardianRelationship $relationship,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Domain\DTOs\Professionals;

use App\Domain\Enums\ProfessionalStatus;
use App\Domain\ValueObjects\Registration;

final readonly class CreateProfessionalDTO
{
    public function __construct(
        public Registration $registration,
        public string $entryDate,
        public ProfessionalStatus $status = ProfessionalStatus::ACTIVE,
    ) {}
}

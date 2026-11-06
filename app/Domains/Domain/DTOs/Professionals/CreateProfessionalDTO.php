<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Professionals;

use App\Domains\Domain\Enums\Professionals\ProfessionalStatus;
use App\Domains\Domain\ValueObjects\Students\Registration;

final readonly class CreateProfessionalDTO
{
    public function __construct(
        public Registration $registration,
        public string $entryDate,
        public ProfessionalStatus $status = ProfessionalStatus::ACTIVE,
    ) {}
}

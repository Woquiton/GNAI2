<?php

declare(strict_types=1);

namespace App\Domain\DTOs\Professionals;

use App\Domain\Enums\ProfessionalStatus;
use App\Domain\ValueObjects\Registration;

final readonly class UpdateProfessionalDTO
{
    public function __construct(
        public Registration $registration,
        public ProfessionalStatus $status,
        public string $entryDate,
    ) {}
}

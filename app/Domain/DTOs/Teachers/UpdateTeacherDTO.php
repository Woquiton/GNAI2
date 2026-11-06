<?php

declare(strict_types=1);

namespace App\Domain\DTOs\Teachers;

use App\Domain\ValueObjects\Registration;

final readonly class UpdateTeacherDTO
{
    public function __construct(
        public Registration $registration,
    ) {}
}

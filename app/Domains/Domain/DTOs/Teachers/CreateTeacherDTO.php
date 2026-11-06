<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Teachers;

use App\Domains\Domain\ValueObjects\Students\Registration;

final readonly class CreateTeacherDTO
{
    public function __construct(
        public int $personId,
        public Registration $registration,
    ) {}
}

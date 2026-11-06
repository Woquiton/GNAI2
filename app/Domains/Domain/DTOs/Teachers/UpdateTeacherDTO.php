<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Teachers;

use App\Domains\Domain\ValueObjects\Students\Registration;

final readonly class UpdateTeacherDTO
{
    public function __construct(
        public Registration $registration,
    ) {}
}

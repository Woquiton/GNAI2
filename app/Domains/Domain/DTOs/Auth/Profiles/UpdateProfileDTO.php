<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Auth\Profiles;

use App\Domains\Domain\Enums\People\Gender;

final readonly class UpdateProfileDTO
{
    public function __construct(
        public string $name,
        public string $registration,
        public string $birthDate,
        public Gender $gender,
        public string $email,
        public ?string $document = null,
        public ?string $phone = null,
        public ?string $address = null,
        public ?string $password = null,
    ) {}
}

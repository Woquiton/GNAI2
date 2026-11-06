<?php

declare(strict_types=1);

namespace App\Domain\DTOs\People;

use App\Domain\Enums\Gender;
use App\Domain\ValueObjects\Cpf;
use App\Domain\ValueObjects\Phone;

final readonly class CreatePersonDTO
{
    public function __construct(
        public string $name,
        public string $birthDate,
        public Gender $gender,
        public ?Cpf $document = null,
        public ?string $email = null,
        public ?Phone $phone = null,
        public ?string $address = null,
        public ?string $photo = null,
    ) {}
}

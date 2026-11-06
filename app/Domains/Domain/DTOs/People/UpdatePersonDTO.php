<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\People;

use App\Domains\Domain\Enums\People\Gender;
use App\Domains\Domain\ValueObjects\People\Cpf;
use App\Domains\Domain\ValueObjects\People\Phone;

final readonly class UpdatePersonDTO
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

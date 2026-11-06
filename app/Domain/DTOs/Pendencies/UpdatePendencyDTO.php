<?php

declare(strict_types=1);

namespace App\Domain\DTOs\Pendencies;

use App\Domain\Enums\Priority;

final readonly class UpdatePendencyDTO
{
    public function __construct(
        public string $title,
        public Priority $priority,
        public ?string $description = null,
        public ?string $dueDate = null,
    ) {}
}

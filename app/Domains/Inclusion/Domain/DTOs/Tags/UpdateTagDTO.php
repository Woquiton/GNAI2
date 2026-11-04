<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Domain\DTOs\Tags;

use App\Domains\Inclusion\Domain\Enums\TagModule;
final readonly class UpdateTagDTO
{
    public function __construct(
        public string $name,
        public bool $isActive = true,
        public TagModule $module = TagModule::PUBLICATIONS,
        public string $color = '#322b75',
    ) {}
}

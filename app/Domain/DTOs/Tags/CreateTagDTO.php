<?php

declare(strict_types=1);

namespace App\Domain\DTOs\Tags;

use App\Domain\Enums\TagModule;
final readonly class CreateTagDTO
{
    public function __construct(
        public string $name,
        public bool $isActive = true,
        public TagModule $module = TagModule::PUBLICATIONS,
        public string $color = '#322b75',
    ) {}
}

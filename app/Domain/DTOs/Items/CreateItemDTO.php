<?php

declare(strict_types=1);

namespace App\Domain\DTOs\Items;

use App\Domain\Enums\ConservationState;
use App\Domain\Enums\ItemType;
use App\Domain\Enums\ResourceStatus;
use App\Domain\ValueObjects\AssetCode;

final readonly class CreateItemDTO
{
    public function __construct(
        public ItemType $itemType,
        public string $name,
        public bool $isDigital,
        public bool $isLoanable,
        public ?int $quantity,
        public ?AssetCode $assetCode,
        public ConservationState $conservationState,
        public ResourceStatus $status = ResourceStatus::AVAILABLE,
        public ?string $notes = null,
        public bool $isActive = true,
    ) {}
}

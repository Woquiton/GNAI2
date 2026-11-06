<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\Items;

use App\Domains\Domain\Enums\Items\ConservationState;
use App\Domains\Domain\Enums\Items\ItemType;
use App\Domains\Domain\Enums\Items\ResourceStatus;
use App\Domains\Domain\ValueObjects\Items\AssetCode;

final readonly class UpdateItemDTO
{
    public function __construct(
        public ItemType $itemType,
        public string $name,
        public bool $isDigital,
        public bool $isLoanable,
        public ?int $quantity,
        public ?AssetCode $assetCode,
        public ConservationState $conservationState,
        public ResourceStatus $status,
        public int $openLoans,
        public ?string $notes = null,
        public bool $isActive = true,
    ) {}
}

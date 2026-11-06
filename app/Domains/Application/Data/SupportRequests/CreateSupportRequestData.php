<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\SupportRequests;

use App\Domains\Domain\Enums\SupportRequests\SupportRequestStatus;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class CreateSupportRequestData extends SupportRequestData
{
    public static function rules(): array
    {
        return array_replace(parent::rules(), [
            'status' => ['sometimes', Rule::in([SupportRequestStatus::RECEIVED->value])],
            'analysis_notes' => ['prohibited'],
            'referrals' => ['prohibited'],
            'remove_attachment_ids' => ['prohibited'],
        ]);
    }
}

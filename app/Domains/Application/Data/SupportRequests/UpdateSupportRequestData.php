<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\SupportRequests;

use App\Domains\Domain\Enums\SupportRequests\SupportRequestStatus;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class UpdateSupportRequestData extends SupportRequestData
{
    public static function rules(): array
    {
        return array_replace(parent::rules(), [
            'status' => ['required', Rule::enum(SupportRequestStatus::class)],
        ]);
    }
}

<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Data\Email;

use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

final class SyncMailboxData extends Data
{
    public function __construct(public string $scope = 'replies') {}

    public static function rules(): array
    {
        return ['scope' => ['sometimes', 'required', Rule::in(['replies', 'folders'])]];
    }
}

<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Notifications\Email;

use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

final class OpenEmailComposerData extends Data
{
    public function __construct(
        public ?string $draft = null,
        public ?string $source = null,
        public string $mode = 'forward',
    ) {}

    public static function rules(): array
    {
        return [
            'draft' => ['nullable', 'uuid', 'prohibits:source'],
            'source' => ['nullable', 'uuid'],
            'mode' => ['sometimes', Rule::in(['reply', 'forward'])],
        ];
    }
}

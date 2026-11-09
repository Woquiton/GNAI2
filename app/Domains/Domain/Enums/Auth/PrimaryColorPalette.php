<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\Auth;

enum PrimaryColorPalette: string
{
    case Lilac = 'lilac';
    case Purple = 'purple';

    public const PREFERENCE_KEY = 'appearance';
}

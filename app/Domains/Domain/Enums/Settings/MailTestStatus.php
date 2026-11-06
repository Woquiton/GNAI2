<?php

declare(strict_types=1);

namespace App\Domains\Domain\Enums\Settings;

enum MailTestStatus: string
{
    case SUCCESS = 'success';
    case FAILED = 'failed';
}

<?php

declare(strict_types=1);

namespace App\Domains\Settings\Domain\Enums;

enum MailTestStatus: string
{
    case SUCCESS = 'success';
    case FAILED = 'failed';
}

<?php

declare(strict_types=1);

namespace App\Domains\Domain\Exceptions\Notifications;

use RuntimeException;

final class EmailMailboxUnavailable extends RuntimeException {}

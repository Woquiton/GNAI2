<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Domain\Exceptions;

use RuntimeException;

final class EmailMailboxUnavailable extends RuntimeException {}

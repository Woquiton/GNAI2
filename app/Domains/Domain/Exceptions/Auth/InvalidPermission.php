<?php

declare(strict_types=1);

namespace App\Domains\Domain\Exceptions\Auth;

use App\Shared\Domain\Exceptions\BusinessRuleException;

final class InvalidPermission extends BusinessRuleException {}

<?php

declare(strict_types=1);

namespace App\Shared\Domain\Exceptions;

use App\Shared\Domain\Exceptions\BusinessRuleException;

/** Regra de negócio violada em um recurso do Gnai. */
abstract class ResourceException extends BusinessRuleException {}

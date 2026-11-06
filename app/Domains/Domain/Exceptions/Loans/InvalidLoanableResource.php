<?php

declare(strict_types=1);

namespace App\Domains\Domain\Exceptions\Loans;

use App\Shared\Domain\Exceptions\ResourceException;

final class InvalidLoanableResource extends ResourceException {}

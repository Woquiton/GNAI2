<?php

declare(strict_types=1);

namespace App\Domains\Application\Contracts\Backup;

interface PruneBackupsActionContract
{
    public function execute(): int;
}

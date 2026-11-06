<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Backup;

use App\Domains\Domain\Models\Backup\Backup;

final readonly class ShowBackupQuery
{
    public function execute(Backup $backup): Backup
    {
        return $backup->load('user');
    }
}

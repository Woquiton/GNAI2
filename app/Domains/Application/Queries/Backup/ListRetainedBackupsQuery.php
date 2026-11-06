<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Backup;

use App\Domains\Domain\Models\Backup\Backup;
use App\Domains\Domain\Enums\Settings\BackupRetentionMode;
use App\Domains\Domain\ValueObjects\Settings\BackupSettings;
use Illuminate\Database\Eloquent\Collection;

final readonly class ListRetainedBackupsQuery
{
    /**
     * Aplica a retenção definida em Configurações > Backups. O backup mais
     * recente é sempre mantido, mesmo quando ultrapassa o período em dias.
     *
     * @return Collection<int, Backup>
     */
    public function execute(BackupSettings $settings): Collection
    {
        if ($settings->retentionMode === BackupRetentionMode::COUNT) {
            return Backup::query()
                ->orderByDesc('created_at')
                ->orderByDesc('id')
                ->limit($settings->retentionValue)
                ->get(['id', 'file_path']);
        }

        $latestId = Backup::query()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->value('id');

        if ($latestId === null) {
            return new Collection;
        }

        return Backup::query()
            ->where('created_at', '>=', now()->subDays($settings->retentionValue))
            ->orWhere('id', $latestId)
            ->get(['id', 'file_path']);
    }
}

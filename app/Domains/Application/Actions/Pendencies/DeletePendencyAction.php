<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Pendencies;

use App\Domains\Domain\Models\Pendencies\Pendency;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeletePendencyAction
{
    /**
     * @throws Throwable
     */
    public function execute(Pendency $pendency): void
    {
        DB::transaction(function () use ($pendency): void {
            Pendency::query()
                ->findOrFail($pendency->getKey())
                ->delete();
        });
    }
}

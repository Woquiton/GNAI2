<?php

declare(strict_types=1);

namespace App\Application\Actions\SupportRequests;

use App\Domain\Models\SupportRequest;
use App\Infrastructure\Storage\SupportRequestAttachmentStorage;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteSupportRequestAction
{
    public function __construct(private SupportRequestAttachmentStorage $storage) {}

    /** @throws Throwable */
    public function execute(SupportRequest $record): void
    {
        $paths = DB::transaction(function () use ($record): array {
            $locked = SupportRequest::query()->lockForUpdate()->findOrFail($record->getKey());
            $attachments = $locked->attachments()->get();
            $paths = $attachments->pluck('file_path')->all();
            foreach ($attachments as $attachment) {
                $attachment->delete();
            }
            $locked->delete();

            return $paths;
        });
        $this->storage->deleteManyQuietly($paths);
    }
}

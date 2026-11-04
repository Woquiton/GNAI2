<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Queries\Email;

use App\Domains\Inclusion\Domain\Enums\TagModule;
use App\Domains\Inclusion\Domain\Models\Tag;
use App\Domains\Notifications\Domain\Enums\EmailMailboxFolder;
use App\Domains\Settings\Application\Queries\GetMailSettingsQuery;

final readonly class EmailMailboxPageQuery
{
    public function __construct(private ListEmailDeliveriesQuery $emails, private GetMailSettingsQuery $settings) {}

    public function execute(int $userId): array
    {
        return [
            'folders' => collect(EmailMailboxFolder::cases())->mapWithKeys(fn ($folder) => [$folder->value => $folder->label()])->all(),
            'folderCounts' => $this->emails->folderCounts($userId),
            'receivingEnabled' => $this->settings->execute()?->receivesGmailReplies() ?? false,
            'folderSyncEnabled' => $this->settings->execute()?->syncsGmailFolders() ?? false,
            'labels' => Tag::query()->where('module', TagModule::INBOX->value)
                ->where(fn ($query) => $query->where('is_active', true)
                    ->orWhereHas('mailboxStates', fn ($state) => $state->where('user_id', $userId)))
                ->orderBy('name')->get()->mapWithKeys(fn (Tag $tag) => [(string) $tag->id => [
                    'name' => $tag->name, 'color' => $tag->color, 'is_active' => $tag->is_active,
                ]])->all(),
        ];
    }
}

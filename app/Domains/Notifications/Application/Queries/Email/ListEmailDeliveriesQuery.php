<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Queries\Email;

use App\Domains\Notifications\Application\Data\Email\ListEmailDeliveriesData;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryContext;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Enums\EmailMailboxFolder;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use App\Domains\Settings\Application\Queries\GetMailSettingsQuery;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final readonly class ListEmailDeliveriesQuery
{
    private ?string $gmailAccountHash;

    public function __construct(GetMailSettingsQuery $settings)
    {
        $mail = $settings->execute();
        $this->gmailAccountHash = ($mail?->syncsGmailFolders() ?? false)
            ? hash('sha256', strtolower((string) $mail->username)) : null;
    }

    public function execute(ListEmailDeliveriesData $filters, int $userId): LengthAwarePaginator
    {
        return $this->inFolder($this->matching($filters, $userId), $filters->folder, $userId)
            ->when($filters->status, fn (Builder $query, string $status) => $query->where('status', $status))
            ->with(['mailboxStates' => fn ($query) => $query->where('user_id', $userId)->with('tag')])
            ->latest('created_at')->orderByDesc('id')
            ->paginate($filters->perPage)->withQueryString();
    }

    public function counts(ListEmailDeliveriesData $filters, int $userId): array
    {
        $counts = array_fill_keys(array_column(EmailDeliveryStatus::cases(), 'value'), 0);
        $rows = $this->inFolder($this->matching($filters, $userId), $filters->folder, $userId)
            ->selectRaw('status, COUNT(*) as aggregate')->groupBy('status')->get();
        foreach ($rows as $row) {
            $counts[$row->status->value] = (int) $row->aggregate;
        }

        return ['all' => array_sum($counts), ...$counts];
    }

    public function folderCounts(int $userId): array
    {
        $counts = [];
        foreach (EmailMailboxFolder::cases() as $folder) {
            $counts[$folder->value] = $this->inFolder(
                $this->visibleTo($userId), $folder->value, $userId,
            )->count();
        }

        return $counts;
    }

    public function visibleTo(int $userId): Builder
    {
        return EmailDelivery::query()->where(fn (Builder $query) => $query
            ->where('status', '!=', EmailDeliveryStatus::DRAFT->value)
            ->orWhere(fn (Builder $draft) => $draft->where('status', EmailDeliveryStatus::DRAFT->value)
                ->where('context_type', EmailDeliveryContext::MAILBOX->value)->where('context_id', $userId)));
    }

    private function matching(ListEmailDeliveriesData $filters, int $userId): Builder
    {
        $query = $this->visibleTo($userId);
        if ($filters->search !== null) {
            $query->where('subject', 'like', '%'.addcslashes($filters->search, '\\%_').'%');
        }
        if ($filters->context !== null) {
            $query->where('context_type', $filters->context);
        }
        if ($filters->label !== null) {
            $query->whereHas('mailboxStates', fn (Builder $state) => $state
                ->where('user_id', $userId)->where('tag_id', $filters->label));
        }
        if ($filters->dateFrom !== null) {
            $query->where('created_at', '>=', CarbonImmutable::parse($filters->dateFrom)->startOfDay());
        }
        if ($filters->dateTo !== null) {
            $query->where('created_at', '<', CarbonImmutable::parse($filters->dateTo)->addDay()->startOfDay());
        }

        return $query;
    }

    private function inFolder(Builder $query, string $folder, int $userId): Builder
    {
        $organized = in_array($folder, ['archive', 'spam', 'trash'], true);
        $personalFolder = static function (Builder $personal) use ($organized, $folder, $userId): void {
            $state = fn (Builder $state) => $state->where('user_id', $userId)
                ->when($organized, fn ($state) => $state->where('folder', $folder), fn ($state) => $state->whereNotNull('folder'));
            if ($organized) {
                $personal->whereHas('mailboxStates', $state);
            } else {
                $personal->whereDoesntHave('mailboxStates', $state);
            }
        };
        if ($this->gmailAccountHash !== null) {
            $query->where(fn (Builder $folders) => $folders
                ->where(fn (Builder $shared) => $shared
                    ->where('gmail_account_hash', $this->gmailAccountHash)->whereNotNull('gmail_message_id')
                    ->when($organized, fn ($shared) => $shared->where('gmail_folder', $folder), fn ($shared) => $shared->whereNull('gmail_folder')))
                ->orWhere(fn (Builder $personal) => $personal
                    ->where(fn (Builder $local) => $local->whereNull('gmail_message_id')->orWhereNull('gmail_account_hash')
                        ->orWhere('gmail_account_hash', '!=', $this->gmailAccountHash))
                    ->where($personalFolder)));
        } else {
            $query->where($personalFolder);
        }
        if ($organized) {
            return $query;
        }

        return match ($folder) {
            'inbox' => $query->where('status', EmailDeliveryStatus::RECEIVED->value),
            'starred' => $query->whereHas('mailboxStates', fn (Builder $state) => $state
                ->where('user_id', $userId)->where('starred', true)),
            'drafts' => $query->where('status', EmailDeliveryStatus::DRAFT->value),
            'sent' => $query->whereIn('status', [EmailDeliveryStatus::SENT->value, EmailDeliveryStatus::BOUNCED->value]),
            'outbox' => $query->whereNotIn('status', [
                EmailDeliveryStatus::DRAFT->value, EmailDeliveryStatus::SENT->value, EmailDeliveryStatus::BOUNCED->value,
                EmailDeliveryStatus::RECEIVED->value,
            ]),
            default => $query,
        };
    }
}

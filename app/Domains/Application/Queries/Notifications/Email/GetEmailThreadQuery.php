<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Notifications\Email;

use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;
use App\Domains\Domain\Models\Notifications\EmailDelivery;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

final readonly class GetEmailThreadQuery
{
    public function __construct(private ListEmailDeliveriesQuery $emails) {}

    /** @return Collection<int, EmailDelivery> */
    public function execute(EmailDelivery $email, int $userId): Collection
    {
        $ids = [$email->id => true];
        $visited = [];
        $frontier = [$email->id];

        // Rascunhos continuam privados e não entram na conversa antes do envio.
        while ($frontier !== [] && $email->status !== EmailDeliveryStatus::DRAFT) {
            $next = [];
            foreach (array_chunk($frontier, 500) as $batch) {
                foreach ($batch as $id) {
                    $visited[$id] = true;
                }
                $links = $this->emails->visibleTo($userId)
                    ->where('status', '!=', EmailDeliveryStatus::DRAFT->value)
                    ->where(fn (Builder $query) => $query->whereIn('id', $batch)->orWhereIn('in_reply_to_id', $batch))
                    ->get(['id', 'in_reply_to_id']);
                foreach ($links as $link) {
                    $ids[$link->id] = true;
                    $next[$link->id] = true;
                    if ($link->in_reply_to_id !== null) {
                        $next[$link->in_reply_to_id] = true;
                    }
                }
            }
            $frontier = array_keys(array_diff_key($next, $visited));
        }

        return $this->emails->visibleTo($userId)
            ->whereIn('id', array_keys($ids))
            ->with([
                'mailboxStates' => fn ($query) => $query->where('user_id', $userId)->with('tag'),
                'inReplyTo:id,subject',
            ])
            ->oldest('created_at')->orderBy('id')->get();
    }
}

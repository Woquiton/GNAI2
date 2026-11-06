<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Notifications;

use App\Domains\Application\Data\Notifications\Email\ListEmailDeliveriesData;
use App\Domains\Application\Data\Notifications\Email\OpenEmailComposerData;
use App\Domains\Application\Policies\Notifications\EmailMailboxAccessPolicy;
use App\Domains\Application\Queries\Notifications\Email\EmailMailboxPageQuery;
use App\Domains\Application\Queries\Notifications\Email\GetEmailThreadQuery;
use App\Domains\Application\Queries\Notifications\Email\ListEmailDeliveriesQuery;
use App\Domains\Domain\Enums\Notifications\EmailDeliveryContext;
use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;
use App\Domains\Domain\Enums\Notifications\EmailPurpose;
use App\Domains\Domain\Models\Notifications\EmailDelivery;
use App\Domains\UI\Presenters\Notifications\EmailComposerPresenter;
use App\Domains\UI\Presenters\Notifications\EmailDeliveryPresenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class EmailDeliveryController
{
    public function index(
        ListEmailDeliveriesData $filters,
        ListEmailDeliveriesQuery $query,
        EmailDeliveryPresenter $presenter,
        EmailMailboxPageQuery $mailbox,
        Request $request,
    ): Response {
        $userId = (int) $request->user()->id;

        return Inertia::render('Notifications/Emails/Index', [
            'emails' => fn () => $query->execute($filters, $userId)
                ->through(fn (EmailDelivery $delivery): array => $presenter->record($delivery)),
            'filters' => $filters->toFilters(),
            'counts' => fn (): array => $query->counts($filters, $userId),
            'mailbox' => fn (): array => $mailbox->execute($userId),
            'canSend' => $request->user()->can('email.send'),
            'statusOptions' => collect(EmailDeliveryStatus::cases())
                ->mapWithKeys(fn (EmailDeliveryStatus $status): array => [$status->value => $status->label()])
                ->all(),
            'contextOptions' => collect(EmailDeliveryContext::cases())
                ->mapWithKeys(fn (EmailDeliveryContext $context): array => [$context->value => $context->label()])
                ->all(),
        ]);
    }

    public function show(
        EmailDelivery $emailDelivery,
        EmailDeliveryPresenter $presenter,
        EmailMailboxAccessPolicy $access,
        EmailMailboxPageQuery $mailbox,
        EmailComposerPresenter $composer,
        GetEmailThreadQuery $thread,
        Request $request,
    ): Response {
        $userId = (int) $request->user()->id;
        $access->ensureCanView($emailDelivery, $userId);
        $messages = $thread->execute($emailDelivery, $userId);
        $emailDelivery = $messages->firstWhere('id', $emailDelivery->id) ?? $emailDelivery;
        $replyTo = $messages->last() ?? $emailDelivery;
        $replyAddress = $replyTo->purpose === EmailPurpose::INCOMING->value
            ? ($replyTo->payload['reply_to'][0] ?? $replyTo->payload['sender_address'] ?? null)
            : $replyTo->recipient_email;

        return Inertia::render('Notifications/Emails/Show', [
            'email' => fn (): array => $presenter->details($emailDelivery, $userId),
            'thread' => fn (): array => $messages
                ->map(fn (EmailDelivery $message): array => $presenter->details($message, $userId))->all(),
            'mailbox' => fn (): array => $mailbox->execute($userId),
            'canSend' => $request->user()->can('email.send'),
            'replyComposer' => $request->user()->can('email.send')
                && $replyTo->status !== EmailDeliveryStatus::DRAFT
                && filter_var($replyAddress, FILTER_VALIDATE_EMAIL)
                ? [...$composer->execute(new OpenEmailComposerData(source: $replyTo->id, mode: 'reply'), $userId), 'body' => ''] : null,
        ]);
    }

    public function attachment(
        EmailDelivery $emailDelivery,
        int $index,
        EmailMailboxAccessPolicy $access,
        Request $request,
    ): StreamedResponse {
        $access->ensureCanView($emailDelivery, (int) $request->user()->id);
        abort_unless(in_array($emailDelivery->purpose, [EmailPurpose::MANUAL->value, EmailPurpose::INCOMING->value], true), 404);
        $file = $emailDelivery->payload['attachments'][$index] ?? null;
        abort_unless(is_array($file) && Storage::disk('local')->exists($file['path']), 404);

        return Storage::disk('local')->download($file['path'], $file['name'], ['X-Content-Type-Options' => 'nosniff']);
    }
}

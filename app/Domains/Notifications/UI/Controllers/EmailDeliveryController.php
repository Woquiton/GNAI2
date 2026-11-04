<?php

declare(strict_types=1);

namespace App\Domains\Notifications\UI\Controllers;

use App\Domains\Notifications\Application\Data\Email\ListEmailDeliveriesData;
use App\Domains\Notifications\Application\Queries\Email\ListEmailDeliveriesQuery;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryContext;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use App\Domains\Notifications\UI\Presenters\EmailDeliveryPresenter;
use Inertia\Inertia;
use Inertia\Response;

final class EmailDeliveryController
{
    public function index(
        ListEmailDeliveriesData $filters,
        ListEmailDeliveriesQuery $query,
        EmailDeliveryPresenter $presenter,
    ): Response {
        return Inertia::render('Notifications/Emails/Index', [
            'emails' => fn () => $query->execute($filters)
                ->through(fn (EmailDelivery $delivery): array => $presenter->record($delivery)),
            'filters' => $filters->toFilters(),
            'counts' => fn (): array => $query->counts($filters),
            'statusOptions' => collect(EmailDeliveryStatus::cases())
                ->mapWithKeys(fn (EmailDeliveryStatus $status): array => [$status->value => $status->label()])
                ->all(),
            'contextOptions' => collect(EmailDeliveryContext::cases())
                ->mapWithKeys(fn (EmailDeliveryContext $context): array => [$context->value => $context->label()])
                ->all(),
        ]);
    }

    public function show(EmailDelivery $emailDelivery, EmailDeliveryPresenter $presenter): Response
    {
        return Inertia::render('Notifications/Emails/Show', [
            'email' => fn (): array => $presenter->details($emailDelivery),
        ]);
    }
}

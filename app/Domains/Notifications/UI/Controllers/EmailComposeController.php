<?php

declare(strict_types=1);

namespace App\Domains\Notifications\UI\Controllers;

use App\Domains\Notifications\Application\Actions\Email\StoreComposedEmailAction;
use App\Domains\Notifications\Application\Data\Email\ComposeEmailData;
use App\Domains\Notifications\Application\Data\Email\OpenEmailComposerData;
use App\Domains\Notifications\Application\Queries\Email\EmailMailboxPageQuery;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\UI\Presenters\EmailComposerPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class EmailComposeController
{
    public function create(
        OpenEmailComposerData $data,
        EmailComposerPresenter $composer,
        EmailMailboxPageQuery $mailbox,
        Request $request,
    ): Response {
        $userId = (int) $request->user()->id;

        return Inertia::render('Notifications/Emails/Compose', [
            'composer' => $composer->execute($data, $userId),
            'mailbox' => $mailbox->execute($userId),
            'canSend' => $request->user()->can('email.send'),
        ]);
    }

    public function store(
        ComposeEmailData $data,
        StoreComposedEmailAction $action,
        Request $request,
    ): RedirectResponse {
        $email = $action->execute($data, (int) $request->user()->id);
        if ($email->status === EmailDeliveryStatus::DRAFT) {
            if ($data->intent === 'send') {
                return to_route('emails.compose', ['draft' => $email->id])
                    ->with('error', 'Não foi possível iniciar o envio. O rascunho e os anexos foram preservados; tente novamente.');
            }

            return to_route('emails.compose', ['draft' => $email->id])->with('success', 'Rascunho salvo.');
        }

        if (! in_array($email->status, [EmailDeliveryStatus::QUEUED, EmailDeliveryStatus::PROCESSING, EmailDeliveryStatus::SENT], true)) {
            return to_route('emails.show', $email)
                ->with('error', 'O serviço não confirmou o envio. Consulte o resultado registrado para esta mensagem.');
        }

        return to_route('emails.show', $email)->with('success', 'Mensagem encaminhada para processamento. Consulte o resultado do envio.');
    }
}

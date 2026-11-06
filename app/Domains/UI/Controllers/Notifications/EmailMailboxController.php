<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Notifications;

use App\Domains\Application\Actions\Notifications\Email\SyncGmailFoldersAction;
use App\Domains\Application\Actions\Notifications\Email\SyncGmailRepliesAction;
use App\Domains\Application\Actions\Notifications\Email\UpdateMailboxAction;
use App\Domains\Application\Data\Notifications\Email\SyncMailboxData;
use App\Domains\Application\Data\Notifications\Email\UpdateMailboxData;
use App\Domains\Domain\Exceptions\Notifications\EmailMailboxUnavailable;
use App\Domains\UI\Presenters\Notifications\EmailMailboxUpdatePresenter;
use App\Domains\Application\Queries\Settings\GetMailSettingsQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

final class EmailMailboxController
{
    public function update(
        UpdateMailboxData $data,
        UpdateMailboxAction $action,
        GetMailSettingsQuery $settings,
        EmailMailboxUpdatePresenter $presenter,
        Request $request,
    ): RedirectResponse {
        if ($data->operation->movesFolder()
            && ($settings->execute()?->syncsGmailFolders() ?? false)) {
            abort_unless($request->user()->can('email.send'), 403);
        }
        try {
            $result = $action->execute($data, (int) $request->user()->id);
        } catch (EmailMailboxUnavailable $exception) {
            return back()->with('error', $exception->getMessage());
        }
        $feedback = $presenter->present($data, $result);

        return back()->with($feedback['tone'], $feedback['message']);
    }

    public function sync(
        SyncMailboxData $data,
        GetMailSettingsQuery $settings,
        SyncGmailRepliesAction $sync,
        SyncGmailFoldersAction $folders,
    ): RedirectResponse {
        $mail = $settings->execute();
        $folderSync = $data->scope === 'folders';
        $enabled = $folderSync ? ($mail?->syncsGmailFolders() ?? false) : ($mail?->receivesGmailReplies() ?? false);
        if (! $enabled) {
            return back()->with('warning', 'Ative a opção correspondente em Configurações → E-mail.');
        }
        try {
            $count = $folderSync ? $folders->execute() : $sync->execute();
            if ($count === null) {
                return back()->with('warning', 'Já existe uma consulta ao Gmail em andamento.');
            }

            if ($folderSync) {
                return back()->with('success', 'Pastas conferidas no Gmail: '.$count.'. Os próximos lotes continuam automaticamente.');
            }

            return back()->with('success', $count > 0
                ? $count.' resposta(s) importada(s). Consulte a Caixa de entrada.'
                : 'Nenhuma nova resposta neste lote. As próximas consultas continuam automaticamente.');
        } catch (Throwable $exception) {
            Log::warning('Falha ao consultar o Gmail pela Inbox.', ['error_type' => $exception::class]);

            return back()->with('error', $exception instanceof EmailMailboxUnavailable
                ? $exception->getMessage() : 'Não foi possível consultar o Gmail. Confira a conexão e tente novamente.');
        }
    }
}

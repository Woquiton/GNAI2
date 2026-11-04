<?php

declare(strict_types=1);

namespace App\Domains\Settings\UI\Controllers;

use App\Domains\Settings\Application\Actions\SendTestMailAction;
use App\Domains\Settings\Application\Actions\UpdateSessionSecuritySettingsAction;
use App\Domains\Settings\Application\Data\UpdateSessionSecuritySettingsData;
use App\Domains\Settings\Application\Queries\GetSessionSecuritySettingsQuery;
use App\Domains\Settings\Application\Actions\UpdateTeacherAccessSettingsAction;
use App\Domains\Settings\Application\Data\UpdateTeacherAccessSettingsData;
use App\Domains\Settings\Application\Queries\GetTeacherAccessSettingsQuery;
use App\Domains\Settings\Application\Actions\UpdateBackupSettingsAction;
use App\Domains\Settings\Application\Actions\UpdateMailSettingsAction;
use App\Domains\Settings\Application\Data\SendTestMailData;
use App\Domains\Settings\Application\Data\UpdateBackupSettingsData;
use App\Domains\Settings\Application\Data\UpdateMailSettingsData;
use App\Domains\Settings\Application\Queries\SettingsFormQuery;
use App\Domains\Settings\Domain\Exceptions\MailTestFailed;
use App\Domains\Settings\Application\Actions\UpdatePdfHeaderSettingsAction;
use App\Domains\Settings\Application\Data\UpdatePdfHeaderSettingsData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

final class SettingsController
{
    public function index(): RedirectResponse
    {
        return redirect()->route('settings.mail.edit');
    }

    public function editMail(SettingsFormQuery $form, Request $request): InertiaResponse
    {
        return Inertia::render('Settings/Mail', [
            ...$form->forMail(),
            'canUpdate' => $request->user()?->can('setting.update') === true,
        ]);
    }

    public function updateMail(UpdateMailSettingsData $data, UpdateMailSettingsAction $action): RedirectResponse
    {
        $action->execute($data);

        return redirect()
            ->route('settings.mail.edit')
            ->with('success', 'Configurações de e-mail salvas com sucesso. Os próximos envios usarão estes dados.');
    }

    /**
     * @throws MailTestFailed
     */
    public function sendTestMail(SendTestMailData $data, SendTestMailAction $action): RedirectResponse
    {
        $result = $action->execute($data);

        $message = $result->loggedOnly
            ? 'Mensagem de teste registrada no log da aplicação. O tipo de envio “Registro em log” não entrega e-mails reais.'
            : "E-mail de teste enviado para {$data->recipient}. Confira a caixa de entrada e a pasta de spam.";

        if (! $result->usedStoredSettings) {
            $message .= ' Como ainda não há configuração cadastrada, foram usados os valores do arquivo .env.';
        }

        return redirect()
            ->route('settings.mail.edit')
            ->with('success', $message);
    }

    public function editBackup(SettingsFormQuery $form, Request $request): InertiaResponse
    {
        return Inertia::render('Settings/Backup', [
            ...$form->forBackup(),
            'canUpdate' => $request->user()?->can('setting.update') === true,
        ]);
    }

    public function updateBackup(UpdateBackupSettingsData $data, UpdateBackupSettingsAction $action): RedirectResponse
    {
        $action->execute($data);

        return redirect()
            ->route('settings.backup.edit')
            ->with('success', 'Configurações de backup salvas com sucesso.');
    }

    public function editTeacherAccess(GetTeacherAccessSettingsQuery $query, Request $request): InertiaResponse
    {
        return Inertia::render('Settings/TeacherAccess', [
            'domains' => $query->execute(),
            'canUpdate' => $request->user()?->can('setting.update') === true,
        ]);
    }

    public function updateTeacherAccess(
        UpdateTeacherAccessSettingsData $data,
        UpdateTeacherAccessSettingsAction $action,
    ): RedirectResponse {
        $action->execute($data);

        return redirect()
            ->route('settings.teacher-access.edit')
            ->with('success', 'Configurações de acesso dos professores salvas com sucesso.');
    }

    public function editSessionSecurity(
        GetSessionSecuritySettingsQuery $query,
        Request $request,
    ): InertiaResponse
    {
        return Inertia::render('Settings/SessionSecurity', [
            'sessionSecuritySettings' => $query->execute()->toPayload(),
            'canUpdate' => $request->user()?->can('setting.update') === true,
        ]);
    }

    public function updateSessionSecurity(
        UpdateSessionSecuritySettingsData $data,
        UpdateSessionSecuritySettingsAction $action,
    ): RedirectResponse {
        $action->execute($data);

        return redirect()
            ->route('settings.session-security.edit')
            ->with('success', 'Configurações de segurança e sessões salvas com sucesso.');
    }

    public function editPdf(
        SettingsFormQuery $form,
        Request $request,
    ): InertiaResponse {
        return Inertia::render('Settings/Pdf', [
            ...$form->forPdf(),
            'canUpdate' => $request->user()?->can('setting.update') === true,
        ]);
    }

    public function updatePdf(UpdatePdfHeaderSettingsData $data, UpdatePdfHeaderSettingsAction $action): RedirectResponse
    {
        $action->execute($data);

        return redirect()
            ->route('settings.pdf.edit')
            ->with('success', 'Cabeçalho dos PDFs salvo com sucesso.');
    }
}

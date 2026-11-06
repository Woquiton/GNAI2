<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Settings;

use App\Domains\Application\Data\Settings\UpdateMailSettingsData;
use App\Domains\Application\Queries\Settings\GetMailSettingsQuery;
use App\Domains\Domain\Enums\Settings\SettingCategory;
use App\Domains\Domain\Models\Settings\Setting;
use App\Domains\Domain\ValueObjects\Settings\MailSettings;
use Illuminate\Support\Facades\Crypt;

final readonly class UpdateMailSettingsAction
{
    public function __construct(
        private GetMailSettingsQuery $mailSettings,
    ) {}

    public function execute(UpdateMailSettingsData $data): MailSettings
    {
        // Chave em branco mantém a atual; o SMTP sempre usa a conta de autenticação informada.
        $password = match (true) {
            $data->password !== null => $data->password,
            default => $this->mailSettings->execute()?->password,
        };

        $settings = new MailSettings(
            transport: $data->transport,
            host: $data->host,
            port: $data->port,
            encryption: $data->encryption,
            username: $data->username,
            password: $password,
            fromAddress: $data->fromAddress,
            fromName: $data->fromName,
            gmailBouncesEnabled: $data->gmailBouncesEnabled,
            gmailBouncesFolder: $data->gmailBouncesFolder,
            gmailInboxEnabled: $data->gmailInboxEnabled,
            gmailInboxFolder: $data->gmailInboxFolder,
            gmailFoldersEnabled: $data->gmailFoldersEnabled,
        );

        Setting::store(SettingCategory::MAIL, [
            ...$settings->toPayload(),
            'password' => $password === null ? null : Crypt::encryptString($password),
        ]);

        return $settings;
    }
}

<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Settings;

use App\Domains\Domain\Enums\Settings\SettingCategory;
use App\Domains\Domain\Models\Settings\Setting;
use App\Domains\Domain\ValueObjects\Settings\MailSettings;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;

final readonly class GetMailSettingsQuery
{
    /**
     * Retorna null enquanto não houver configuração cadastrada; nesse caso o
     * envio continua usando os valores do .env (único fallback legado mantido).
     */
    public function execute(): ?MailSettings
    {
        $payload = Setting::payloadFor(SettingCategory::MAIL);

        if ($payload === null) {
            return null;
        }

        return MailSettings::fromPayload($payload, $this->decryptPassword($payload['password'] ?? null));
    }

    private function decryptPassword(mixed $encrypted): ?string
    {
        if (! is_string($encrypted) || $encrypted === '') {
            return null;
        }

        try {
            return Crypt::decryptString($encrypted);
        } catch (DecryptException) {
            Log::error('A senha de e-mail cadastrada não pôde ser descriptografada. Verifique se a APP_KEY foi alterada e cadastre a senha novamente.');

            return null;
        }
    }
}

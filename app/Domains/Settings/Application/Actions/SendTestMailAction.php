<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Actions;

use App\Domains\Notifications\Application\Actions\Email\SendEmailNowAction;
use App\Domains\Notifications\Domain\DTOs\EmailMessageDTO;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Settings\Application\Data\SendTestMailData;
use App\Domains\Settings\Domain\DTOs\TestMailResultDTO;
use App\Domains\Settings\Domain\Enums\MailTestStatus;
use App\Domains\Settings\Domain\Enums\SettingCategory;
use App\Domains\Settings\Domain\Exceptions\MailTestFailed;
use App\Domains\Settings\Domain\Models\Setting;
use App\Domains\Settings\Domain\ValueObjects\MailSettings;
use App\Domains\Settings\Infrastructure\Mail\MailSettingsConfigurator;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

final readonly class SendTestMailAction
{
    public function __construct(
        private MailSettingsConfigurator $configurator,
        private SendEmailNowAction $sendEmail,
        private Repository $config,
    ) {}

    /**
     * Envia usando a configuração efetiva: a cadastrada ou, sem cadastro, a do .env.
     *
     * @throws MailTestFailed
     */
    public function execute(SendTestMailData $data): TestMailResultDTO
    {
        $settings = $this->configurator->apply();

        try {
            $delivery = $this->sendEmail->execute(new EmailMessageDTO(
                contextType: 'settings',
                contextId: 0,
                purpose: 'mail_test',
                deduplicationKey: 'mail-test:'.Str::uuid(),
                recipientEmail: $data->recipient,
                recipientName: null,
                subject: 'Teste de configuração de e-mail - Gnai',
                view: 'emails.notifications.alert',
                textView: 'emails.notifications.alert-text',
                payload: [
                    'heading' => 'Teste de configuração de e-mail',
                    'greeting' => 'Olá!',
                    'paragraphs' => [
                        'Somos do Gnai e estamos enviando esta mensagem para verificar se o serviço de e-mails foi configurado corretamente.',
                        'Se você recebeu este e-mail, significa que o teste de envio foi realizado com sucesso.',
                    ],
                    'outro' => 'Atenciosamente, Equipe Gnai.',
                ],
            ));
            $loggedOnly = $delivery->status === EmailDeliveryStatus::NOT_SENT
                && $this->config->get('mail.default') === 'log';
            if ($delivery->status !== EmailDeliveryStatus::SENT && ! $loggedOnly) {
                throw new RuntimeException('O serviço não confirmou o envio da mensagem de teste.');
            }
        } catch (Throwable $exception) {
            $detail = $exception->getMessage();
            $password = $settings?->password ?? $this->config->get('mail.mailers.smtp.password');

            if (is_string($password) && $password !== '') {
                $detail = str_replace($password, '********', $detail);
            }

            $detail = trim((string) preg_replace('/\s+/', ' ', $detail));

            Log::warning('Falha ao enviar o e-mail de teste das configurações.', [
                'recipient' => $data->recipient,
                'error' => $detail,
            ]);

            $this->recordStatus($settings, MailTestStatus::FAILED);

            throw MailTestFailed::fromDetail($detail);
        }

        $this->recordStatus($settings, MailTestStatus::SUCCESS);

        return new TestMailResultDTO(
            usedStoredSettings: $settings !== null,
            loggedOnly: $loggedOnly,
        );
    }

    private function recordStatus(?MailSettings $settings, MailTestStatus $status): void
    {
        if (! $settings instanceof MailSettings) {
            return;
        }

        $payload = Setting::payloadFor(SettingCategory::MAIL);

        if ($payload === null) {
            return;
        }

        Setting::store(SettingCategory::MAIL, [
            ...$payload,
            'test_status' => $status->value,
            'last_tested_at' => now()->toIso8601String(),
        ]);
    }
}

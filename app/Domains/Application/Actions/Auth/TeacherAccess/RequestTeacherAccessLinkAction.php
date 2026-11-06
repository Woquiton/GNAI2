<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\TeacherAccess;

use App\Domains\Application\Data\Auth\TeacherAccess\RequestTeacherAccessLinkData;
use App\Domains\Domain\Models\Auth\TeacherAccessToken;
use App\Domains\Domain\Models\Teachers\Teacher;
use App\Domains\Application\Actions\Notifications\Email\QueueEmailAction;
use App\Domains\Domain\DTOs\Notifications\EmailMessageDTO;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

final class RequestTeacherAccessLinkAction
{
    public function __construct(private readonly QueueEmailAction $queueEmail) {}

    /**
     * A resposta ao usuário é genérica. Sem professor com esse e-mail, não envia
     * nada; falhas no envio são tratadas pelo motor após o commit do token.
     *
     * @throws Throwable
     */
    public function execute(RequestTeacherAccessLinkData $data, ?string $requesterIp): void
    {
        $email = Str::lower(trim($data->email));

        $teacher = Teacher::query()
            ->with('person')
            ->whereHas('person', fn ($query) => $query->whereRaw('LOWER(email) = ?', [$email]))
            ->first();

        if ($teacher === null) {
            return;
        }

        DB::transaction(function () use ($teacher, $requesterIp, $email): void {
            TeacherAccessToken::query()
                ->where('teacher_id', $teacher->getKey())
                ->whereNull('used_at')
                ->update(['expires_at' => now()->subSecond()]);

            $rawToken = rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');

            $accessToken = TeacherAccessToken::create([
                'teacher_id' => $teacher->getKey(),
                'token_hash' => hash('sha256', $rawToken),
                'expires_at' => now()->addHours(24),
                'requester_ip' => $requesterIp,
                'created_at' => now(),
            ]);

            $confirmUrl = route('teacher-access.confirm.show', ['token' => $rawToken]);

            $this->queueEmail->execute(new EmailMessageDTO(
                contextType: 'teacher',
                contextId: (int) $teacher->getKey(),
                purpose: 'teacher_access_link',
                deduplicationKey: 'teacher-access-link:'.$accessToken->getKey(),
                recipientEmail: $email,
                recipientName: $teacher->person?->name,
                subject: 'Gnai - Seu link de acesso',
                view: 'emails.notifications.alert',
                textView: 'emails.notifications.alert-text',
                payload: [
                    'heading' => 'Seu link de acesso',
                    'greeting' => 'Olá.',
                    'paragraphs' => [
                        'Recebemos uma solicitação de acesso ao Gnai para este e-mail.',
                        'Clique no botão abaixo para acessar sua conta de professor(a).',
                        'Este link é válido por 24 horas e serve para um único acesso. Não compartilhe este e-mail com mais ninguém.',
                    ],
                    'actionLabel' => 'Acessar o Gnai',
                    'actionUrl' => $confirmUrl,
                    'outro' => 'Se você não solicitou este acesso, apenas ignore este e-mail. Nenhuma ação será feita.',
                ],
            ));
        });
    }
}

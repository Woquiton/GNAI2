<?php

declare(strict_types=1);

namespace App\Domains\Auth\Application\Actions\TeacherAccess;

use App\Domains\Auth\Application\Data\TeacherAccess\RequestTeacherAccessLinkData;
use App\Domains\Auth\Domain\Models\SentEmail;
use App\Domains\Auth\Domain\Models\TeacherAccessToken;
use App\Domains\Auth\Infrastructure\Notifications\TeacherAccessLinkNotification;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Throwable;

final class RequestTeacherAccessLinkAction
{
    /**
     * Sempre retorna sem lançar exceção para quem chama (a resposta ao usuário
     * é sempre genérica). Se não houver professor ativo com esse e-mail,
     * simplesmente não envia nada.
     *
     * @throws Throwable
     */
    public function execute(RequestTeacherAccessLinkData $data, ?string $requesterIp): void
    {
        $email = Str::lower(trim($data->email));

        $teacher = Teacher::query()
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

            TeacherAccessToken::create([
                'teacher_id' => $teacher->getKey(),
                'token_hash' => hash('sha256', $rawToken),
                'expires_at' => now()->addHours(24),
                'requester_ip' => $requesterIp,
                'created_at' => now(),
            ]);

            $confirmUrl = route('teacher-access.confirm.show', ['token' => $rawToken]);

            try {
                // O envio real acontece de forma assíncrona (fila). Se a
                // entrega falhar depois de esgotar as tentativas, quem
                // registra o status "failed" é o próprio
                // TeacherAccessLinkNotification::failed(), não aqui — aqui só
                // confirmamos que o job foi colocado na fila com sucesso.
                Notification::route('mail', $email)
                    ->notify(new TeacherAccessLinkNotification($confirmUrl, $email));

                SentEmail::create([
                    'recipient' => $email,
                    'type' => 'link_acesso',
                    'status' => SentEmail::STATUS_SENT,
                    'created_at' => now(),
                ]);
            } catch (Throwable $exception) {
                Log::error('Falha ao enfileirar e-mail de link de acesso do professor.', [
                    'recipient' => $email,
                    'error' => $exception->getMessage(),
                ]);

                SentEmail::create([
                    'recipient' => $email,
                    'type' => 'link_acesso',
                    'status' => SentEmail::STATUS_FAILED,
                    'error' => $exception->getMessage(),
                    'created_at' => now(),
                ]);

                throw $exception;
            }
        });
    }
}

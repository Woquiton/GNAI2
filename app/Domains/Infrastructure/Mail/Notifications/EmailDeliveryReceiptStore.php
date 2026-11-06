<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Mail\Notifications;

use App\Domains\Domain\DTOs\Notifications\EmailDeliveryReceiptDTO;
use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

/** Guarda somente o resultado técnico, sem destinatário ou conteúdo da mensagem. */
final class EmailDeliveryReceiptStore
{
    private const DIRECTORY = 'email-delivery-receipts';

    public function put(EmailDeliveryReceiptDTO $receipt): void
    {
        $disk = Storage::disk('local');
        $path = $this->path($receipt->deliveryId);
        $temporary = $path.'.tmp';
        $written = $disk->put($temporary, json_encode([
            'delivery_id' => $receipt->deliveryId,
            'status' => $receipt->status->value,
            'sent_at' => $receipt->sentAt,
            'message_id' => $receipt->messageId,
        ], JSON_THROW_ON_ERROR));

        if (! $written || ! $disk->move($temporary, $path)) {
            throw new RuntimeException('Não foi possível guardar o resultado do envio de e-mail.');
        }
    }

    public function find(string $deliveryId): ?EmailDeliveryReceiptDTO
    {
        $disk = Storage::disk('local');
        $path = $this->path($deliveryId);
        if (! $disk->exists($path)) {
            return null;
        }

        $data = json_decode($disk->get($path), true, 512, JSON_THROW_ON_ERROR);
        $status = EmailDeliveryStatus::from($data['status']);
        if ($data['delivery_id'] !== $deliveryId || ! in_array($status, [
            EmailDeliveryStatus::SENT, EmailDeliveryStatus::NOT_SENT,
        ], true)) {
            throw new RuntimeException('Resultado de envio de e-mail inválido.');
        }

        return new EmailDeliveryReceiptDTO($deliveryId, $status, $data['sent_at'], $data['message_id']);
    }

    /** @return list<string> */
    public function pendingIds(): array
    {
        return array_values(array_map(
            static fn (string $path): string => basename($path, '.json'),
            array_filter(
                Storage::disk('local')->files(self::DIRECTORY),
                static fn (string $path): bool => str_ends_with($path, '.json'),
            ),
        ));
    }

    public function forget(string $deliveryId): void
    {
        $disk = Storage::disk('local');
        $path = $this->path($deliveryId);
        if ($disk->exists($path) && ! $disk->delete($path)) {
            throw new RuntimeException('Não foi possível remover o resultado já registrado do e-mail.');
        }
    }

    private function path(string $deliveryId): string
    {
        return self::DIRECTORY.'/'.basename($deliveryId).'.json';
    }
}

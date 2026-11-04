<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Infrastructure\Mail;

use App\Domains\Notifications\Domain\Exceptions\EmailMailboxUnavailable;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

final readonly class EmailAttachmentStorage
{
    /** @param list<UploadedFile> $files */
    public function store(array $files, string $deliveryId): array
    {
        $stored = [];
        try {
            foreach ($files as $file) {
                $path = $file->store('email-attachments/'.$deliveryId, 'local');
                if ($path === false) {
                    throw new RuntimeException('Não foi possível armazenar o anexo.');
                }
                $stored[] = [
                    'path' => $path,
                    'name' => preg_replace('/[\x00-\x1f\x7f]/u', '', basename(str_replace('\\', '/', $file->getClientOriginalName()))) ?: 'anexo',
                    'mime' => $file->getMimeType() ?: 'application/octet-stream',
                    'size' => $file->getSize(),
                ];
            }

            return $stored;
        } catch (\Throwable $exception) {
            $this->delete($stored);

            throw $exception;
        }
    }

    public function delete(array $attachments): void
    {
        foreach ($attachments as $attachment) {
            try {
                if (! Storage::disk('local')->delete($attachment['path'])) {
                    Log::warning('Não foi possível limpar um anexo de e-mail removido.');
                }
            } catch (\Throwable $exception) {
                // A limpeza de arquivo não pode impedir o despacho de uma mensagem já salva.
                Log::warning('Não foi possível limpar um anexo de e-mail removido.', [
                    'error_type' => $exception::class,
                ]);
            }
        }
    }

    public function copy(array $attachments, string $deliveryId): array
    {
        $copies = [];
        try {
            foreach ($attachments as $attachment) {
                $path = 'email-attachments/'.$deliveryId.'/'.Str::uuid();
                if (! Storage::disk('local')->copy($attachment['path'], $path)) {
                    throw new RuntimeException('Não foi possível copiar o anexo para o encaminhamento.');
                }
                $copies[] = [...$attachment, 'path' => $path];
            }

            return $copies;
        } catch (\Throwable $exception) {
            $this->delete($copies);

            throw $exception;
        }
    }

    public function storeContent(string $content, string $name, string $mime, string $deliveryId): array
    {
        $path = 'email-attachments/'.$deliveryId.'/'.Str::uuid();
        if (! Storage::disk('local')->put($path, $content)) {
            throw new EmailMailboxUnavailable('Não foi possível guardar um anexo recebido.');
        }

        return [
            'path' => $path,
            'name' => preg_replace('/[\x00-\x1f\x7f]/u', '', basename(str_replace('\\', '/', $name))) ?: 'anexo',
            'mime' => $mime, 'size' => strlen($content),
        ];
    }
}

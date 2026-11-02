<?php

declare(strict_types=1);

namespace App\Domains\Settings\Infrastructure\Storage;

use App\Domains\Settings\Domain\ValueObjects\PdfHeaderSettings;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

final class PdfHeaderLogoStorage
{
    private const DIRECTORY = 'settings/pdf-header';

    public function store(UploadedFile $file): string
    {
        $path = $file->store(self::DIRECTORY, 'public');

        if (! is_string($path) || $path === '') {
            throw new RuntimeException('Não foi possível salvar o logotipo dos PDFs.');
        }

        return $path;
    }

    public function delete(?string $path): void
    {
        if ($path !== null && str_starts_with($path, self::DIRECTORY.'/')) {
            Storage::disk('public')->delete($path);
        }
    }

    public function absolutePath(PdfHeaderSettings $settings): ?string
    {
        if ($settings->logoHidden) {
            return null;
        }

        if ($settings->logoPath !== null && str_starts_with($settings->logoPath, self::DIRECTORY.'/')) {
            $path = Storage::disk('public')->path($settings->logoPath);

            return is_file($path) ? $path : null;
        }

        $path = public_path('images/gnai.png');

        return is_file($path) ? $path : null;
    }

    public function url(PdfHeaderSettings $settings): ?string
    {
        if ($this->absolutePath($settings) === null) {
            return null;
        }

        return $settings->logoPath !== null
            ? Storage::disk('public')->url($settings->logoPath)
            : asset('images/gnai.png');
    }
}

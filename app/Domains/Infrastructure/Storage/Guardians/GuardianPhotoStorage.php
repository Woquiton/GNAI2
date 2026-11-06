<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Storage\Guardians;

use App\Domains\Domain\Exceptions\Guardians\InvalidGuardian;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class GuardianPhotoStorage
{
    /**
     * @throws InvalidGuardian
     */
    public function store(UploadedFile $photo): string
    {
        $path = $photo->store('photos', 'public');

        if (! is_string($path) || $path === '') {
            throw new InvalidGuardian('Não foi possível armazenar a foto do responsável.');
        }

        return $path;
    }

    public function delete(?string $path): void
    {
        if (filled($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}

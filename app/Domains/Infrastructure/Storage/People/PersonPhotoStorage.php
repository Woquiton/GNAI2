<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Storage\People;

use App\Domains\Domain\Exceptions\People\InvalidPerson;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class PersonPhotoStorage
{
    public function store(UploadedFile $photo): string
    {
        $path = $photo->store('photos', 'public');
        if (! is_string($path) || $path === '') {
            throw new InvalidPerson('Não foi possível armazenar a foto da pessoa.');
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

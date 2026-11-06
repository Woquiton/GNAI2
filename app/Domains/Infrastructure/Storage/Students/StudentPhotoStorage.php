<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Storage\Students;

use App\Domains\Domain\Exceptions\Students\InvalidStudent;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class StudentPhotoStorage
{
    /**
     * @throws InvalidStudent
     */
    public function store(UploadedFile $photo): string
    {
        $path = $photo->store('photos', 'public');

        if (! is_string($path) || $path === '') {
            throw new InvalidStudent('Não foi possível armazenar a foto do aluno.');
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

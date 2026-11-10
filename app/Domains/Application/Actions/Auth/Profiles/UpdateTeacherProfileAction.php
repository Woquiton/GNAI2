<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\Profiles;

use App\Domains\Application\Data\Auth\Profiles\UpdateTeacherProfileData;
use App\Domains\Domain\Exceptions\Auth\InvalidProfile;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Infrastructure\Storage\Auth\ProfilePhotoStorage;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdateTeacherProfileAction
{
    public function __construct(private ProfilePhotoStorage $photoStorage) {}

    public function execute(User $user, UpdateTeacherProfileData $data): void
    {
        $person = $user->teacher?->person;
        if (! $person instanceof Person) {
            throw new InvalidProfile('Vínculo de professor não encontrado para este usuário.');
        }

        $oldPhoto = $person->photo;
        $newPhoto = $oldPhoto;
        if ($data->photo !== null) {
            $newPhoto = $this->photoStorage->store($data->photo);
        } elseif ($data->removePhoto) {
            $newPhoto = null;
        }

        try {
            DB::transaction(function () use ($user, $person, $data, $newPhoto): void {
                $person->fill(['name' => $data->name, 'photo' => $newPhoto])->save();
                $user->fill(['name' => $data->name])->save();
            });
        } catch (Throwable $exception) {
            if ($data->photo !== null && $newPhoto !== $oldPhoto) {
                $this->photoStorage->delete($newPhoto);
            }
            throw $exception;
        }

        if ($oldPhoto !== $newPhoto) {
            $this->photoStorage->delete($oldPhoto);
        }
    }
}

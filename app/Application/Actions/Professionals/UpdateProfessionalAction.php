<?php

declare(strict_types=1);

namespace App\Application\Actions\Professionals;

use App\Domains\Auth\Application\Policies\AdministratorAccessPolicy;
use App\Domains\Auth\Domain\Models\User;
use App\Application\Data\Professionals\UpdateProfessionalData;
use App\Application\Queries\Professionals\ProfessionalHasPendingPendenciesQuery;
use App\Application\Queries\Professionals\ProfessionalHasSessionsQuery;
use App\Domain\DTOs\People\UpdatePersonDTO;
use App\Domain\DTOs\Professionals\UpdateProfessionalDTO;
use App\Domain\Enums\ProfessionalStatus;
use App\Domain\Models\Person;
use App\Domain\Models\Position;
use App\Domain\Models\Professional;
use App\Domain\ValueObjects\Cpf;
use App\Domain\ValueObjects\Phone;
use App\Domain\ValueObjects\Registration;
use App\Infrastructure\Storage\ProfessionalPhotoStorage;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdateProfessionalAction
{
    public function __construct(
        private ProfessionalHasPendingPendenciesQuery $hasPendingPendencies,
        private ProfessionalHasSessionsQuery $hasSessions,
        private ProfessionalPhotoStorage $photoStorage,
        private AdministratorAccessPolicy $administratorAccess,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Professional $professional, UpdateProfessionalData $data, ?User $actor): Professional
    {
        $newPhotoPath = $data->photo !== null
            ? $this->photoStorage->store($data->photo)
            : null;
        $oldPhotoPath = null;

        try {
            $updatedProfessional = DB::transaction(function () use ($professional, $data, $actor, $newPhotoPath, &$oldPhotoPath): Professional {
                $lockedProfessional = Professional::query()
                    ->lockForUpdate()
                    ->findOrFail($professional->getKey());
                $position = Position::query()
                    ->findOrFail($data->positionId);
                $position->ensureIsActive();
                $person = Person::query()
                    ->lockForUpdate()
                    ->findOrFail($lockedProfessional->person_id);
                $currentPhotoPath = $person->getRawOriginal('photo');
                $user = $lockedProfessional->user()->first();
                $inactivating = $lockedProfessional->status !== $data->status
                    && $data->status === ProfessionalStatus::INACTIVE;

                if ($inactivating) {
                    $lockedProfessional->ensureCanBeInactivated(
                        hasPendingPendencies: $this->hasPendingPendencies->execute($lockedProfessional),
                        hasSessions: $this->hasSessions->execute($lockedProfessional),
                    );
                    $this->administratorAccess->ensureCanRevokeAccess($actor, $user);
                }

                if ($user !== null) {
                    $this->administratorAccess->ensureCanChangeEmail($actor, $user, $data->email);

                    if ($data->isAdmin !== null) {
                        $this->administratorAccess->ensureCanAssign($actor, $user, $data->isAdmin);
                    }
                }

                if ($newPhotoPath !== null) {
                    $photoPath = $newPhotoPath;
                    $oldPhotoPath = $currentPhotoPath;
                } elseif ($data->removePhoto) {
                    $photoPath = null;
                    $oldPhotoPath = $currentPhotoPath;
                } else {
                    $photoPath = $currentPhotoPath;
                }

                $personDTO = new UpdatePersonDTO(
                    name: $data->name,
                    birthDate: $data->birthDate,
                    gender: $data->gender,
                    document: Cpf::fromNullable($data->document),
                    email: $data->email,
                    phone: Phone::fromNullable($data->phone),
                    address: $data->address,
                    photo: $photoPath,
                );

                $person->revise($personDTO);
                $person->save();

                $professionalDTO = new UpdateProfessionalDTO(
                    registration: Registration::from($data->registration),
                    status: $data->status,
                    entryDate: $data->entryDate,
                );

                $lockedProfessional->revise($position, $professionalDTO);

                if ($data->showOnWebsite !== null) {
                    $lockedProfessional->showOnWebsite($data->showOnWebsite);
                }

                $lockedProfessional->save();

                if ($user !== null) {
                    $userData = [
                        'name' => $person->name,
                        'email' => $person->email,
                    ];

                    if ($data->isAdmin !== null) {
                        $userData['is_admin'] = $data->isAdmin;
                    }

                    $user->update($userData);
                }

                return $lockedProfessional->load(['person', 'position', 'user']);
            });
        } catch (Throwable $exception) {
            $this->photoStorage->delete($newPhotoPath);

            throw $exception;
        }

        if ($oldPhotoPath !== null && $oldPhotoPath !== $newPhotoPath) {
            $this->photoStorage->delete($oldPhotoPath);
        }

        return $updatedProfessional;
    }
}

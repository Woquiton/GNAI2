<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\People;

use App\Domains\Application\Actions\Auth\Passwords\SendPasswordResetLinkAction;
use App\Domains\Application\Data\Auth\Passwords\SendPasswordResetLinkData;
use App\Domains\Application\Data\People\SavePersonData;
use App\Domains\Application\Permissions\Auth\PermissionCache;
use App\Domains\Domain\DTOs\People\CreatePersonDTO;
use App\Domains\Domain\DTOs\People\UpdatePersonDTO;
use App\Domains\Domain\Enums\People\PersonRole;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Tags\Tag;
use App\Domains\Domain\ValueObjects\People\Cpf;
use App\Domains\Domain\ValueObjects\People\Phone;
use App\Domains\Infrastructure\Storage\People\PersonPhotoStorage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Throwable;

final readonly class SavePersonAction
{
    public function __construct(
        private PersonPhotoStorage $photos,
        private PermissionCache $permissionCache,
        private SavePersonStudentAction $student,
        private SavePersonTeacherAction $teacher,
        private SavePersonProfessionalAction $professional,
        private SavePersonGuardiansAction $guardians,
        private SavePersonAccessAction $access,
        private SendPasswordResetLinkAction $sendPasswordResetLink,
    ) {}

    /** @throws Throwable */
    public function execute(SavePersonData $data, User $actor, ?Person $person = null): Person
    {
        $newPhoto = $data->photo !== null ? $this->photos->store($data->photo) : null;
        $oldPhoto = null;
        $accessUser = null;

        try {
            $saved = DB::transaction(function () use ($data, $actor, $person, $newPhoto, &$oldPhoto, &$accessUser): Person {
                $person = $person ? Person::query()->lockForUpdate()->findOrFail($person->getKey()) : new Person;
                $person->load(['student', 'teacher', 'professional', 'guardians']);
                $person->ensureRolesArePreserved($data->roles);
                foreach ($data->roles as $value) {
                    $role = PersonRole::from($value);
                    $operation = $person->hasRole($role) ? 'update' : 'create';
                    Gate::forUser($actor)->authorize($role->value.'.'.$operation);
                }

                $oldPhoto = $person->getRawOriginal('photo');
                $photo = $newPhoto ?? ($data->removePhoto ? null : $oldPhoto);
                $attributes = [
                    'name' => $data->name,
                    'birthDate' => $data->birthDate,
                    'gender' => $data->gender,
                    'document' => Cpf::fromNullable($data->document),
                    'email' => $data->email,
                    'phone' => Phone::fromNullable($data->phone),
                    'address' => $data->address,
                    'photo' => $photo,
                ];
                if ($person->exists) {
                    $person->revise(new UpdatePersonDTO(...$attributes));
                } else {
                    $person = Person::register(new CreatePersonDTO(...$attributes));
                }
                $person->save();

                foreach ($data->roles as $value) {
                    match (PersonRole::from($value)) {
                        PersonRole::STUDENT => $this->student->execute($person, $data),
                        PersonRole::TEACHER => $this->teacher->execute($person, $data),
                        PersonRole::PROFESSIONAL => $this->professional->execute($person, $data, $actor),
                        PersonRole::GUARDIAN => $this->guardians->execute($person, $data, $actor),
                    };
                }
                $person->unsetRelations()->load(['teacher', 'professional']);
                $accessUser = $this->access->execute($person, $actor);
                $tags = Tag::query()->whereKey($data->tagIds)->get();
                $person->ensureConventionalTagsCanBeAssigned($tags);
                $person->tags()->sync($tags->modelKeys());

                return $person;
            });
        } catch (Throwable $exception) {
            $this->photos->delete($newPhoto);
            throw $exception;
        }

        if (($newPhoto !== null || $data->removePhoto) && $oldPhoto !== $newPhoto) {
            $this->photos->delete($oldPhoto);
        }
        if (in_array(PersonRole::PROFESSIONAL->value, $data->roles, true)) {
            DB::afterCommit(fn () => $this->permissionCache->invalidate());
        }
        if ($accessUser !== null) {
            DB::afterCommit(fn () => $this->sendPasswordResetLink->execute(
                new SendPasswordResetLinkData(email: $accessUser->email),
            ));
        }

        return $saved;
    }
}

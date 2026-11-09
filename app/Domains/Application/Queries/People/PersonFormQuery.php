<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\People;

use App\Domains\Domain\Enums\Guardians\GuardianRelationship;
use App\Domains\Domain\Enums\People\Gender;
use App\Domains\Domain\Enums\People\PersonRole;
use App\Domains\Domain\Enums\Professionals\ProfessionalStatus;
use App\Domains\Domain\Enums\Students\StudentFollowUpType;
use App\Domains\Domain\Enums\Students\StudentStatus;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Positions\Position;
use App\Domains\Domain\Models\Students\Student;
use App\Domains\Domain\Models\Tags\Tag;

final class PersonFormQuery
{
    public function execute(User $user, ?Person $person = null): array
    {
        $person?->load(['student', 'teacher', 'professional', 'guardians', 'tags']);
        $options = static fn (string $enum): array => collect($enum::cases())->mapWithKeys(fn ($case) => [$case->value => $case->label()])->all();
        $canRoles = [];
        $canEditExisting = true;
        foreach (PersonRole::cases() as $role) {
            $exists = $person?->hasRole($role) ?? false;
            $operation = $exists ? 'update' : 'create';
            $canRoles[$role->value] = $user->can($role->value.'.'.$operation);
            if ($exists && ! $canRoles[$role->value]) {
                $canEditExisting = false;
            }
        }

        return [
            'genders' => $options(Gender::class),
            'studentStatuses' => $options(StudentStatus::class),
            'followUpTypes' => $options(StudentFollowUpType::class),
            'professionalStatuses' => $options(ProfessionalStatus::class),
            'relationships' => $options(GuardianRelationship::class),
            'positions' => Position::query()->orderBy('name')->get(['id', 'name']),
            'students' => $user->can('guardian.create') || $user->can('guardian.update')
                ? Student::query()->with('person:id,name')->orderBy('id')->get()->map(fn ($student) => ['id' => $student->id, 'name' => $student->person->name.' — '.$student->registration]) : [],
            'tags' => Tag::query()->where('module', 'people')->whereNull('system_key')->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'specialTags' => Tag::query()->whereNotNull('system_key')->orderBy('name')->get(['system_key', 'name']),
            'defaults' => ['gender' => Gender::NOT_SPECIFIED->value, 'studentStatus' => StudentStatus::ACTIVE->value, 'professionalStatus' => ProfessionalStatus::ACTIVE->value],
            'canRoles' => $canRoles,
            'canSave' => $user->can($person ? 'person.update' : 'person.create')
                && $canEditExisting,
        ];
    }
}

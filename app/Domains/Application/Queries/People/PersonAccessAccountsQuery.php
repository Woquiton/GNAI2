<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\People;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\People\Person;
use Illuminate\Database\Eloquent\Collection;

final class PersonAccessAccountsQuery
{
    /** @return Collection<int, User> */
    public function execute(Person $person, bool $lock = false): Collection
    {
        $teacherId = $person->teacher?->getKey();
        $professionalId = $person->professional?->getKey();
        if ($teacherId === null && $professionalId === null) {
            return new Collection;
        }

        return User::query()
            ->where(function ($query) use ($teacherId, $professionalId): void {
                if ($teacherId !== null) {
                    $query->where('teacher_id', $teacherId);
                }
                if ($professionalId !== null) {
                    $query->orWhere('professional_id', $professionalId);
                }
            })
            ->when($lock, fn ($query) => $query->lockForUpdate())
            ->get();
    }
}

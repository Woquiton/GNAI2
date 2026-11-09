<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Professionals;

use App\Domains\Application\Policies\Auth\AdministratorAccessPolicy;
use App\Domains\Application\Permissions\Auth\PermissionCache;
use App\Domains\Application\Queries\Professionals\ProfessionalHasLinkedRecordsQuery;
use App\Domains\Domain\Enums\People\PersonRole;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Professionals\Professional;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteProfessionalAction
{
    public function __construct(
        private ProfessionalHasLinkedRecordsQuery $hasLinkedRecords,
        private AdministratorAccessPolicy $administratorAccess,
        private PermissionCache $permissionCache,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Professional $professional, ?User $actor): void
    {
        DB::transaction(function () use ($professional, $actor): void {
            $lockedProfessional = Professional::query()
                ->lockForUpdate()
                ->findOrFail($professional->getKey());
            $lockedProfessional->ensureCanBeDeletedBy(
                $actor?->professional_id === null ? null : (int) $actor->professional_id,
            );
            $lockedProfessional->ensureCanBeDeleted(
                $this->hasLinkedRecords->execute($lockedProfessional),
            );
            $this->administratorAccess->ensureCanRevokeAccess(
                $actor,
                $lockedProfessional->user()->first(),
            );

            Person::query()
                ->lockForUpdate()
                ->findOrFail($lockedProfessional->person_id);

            // Pelo model, não pela query: a exclusão do usuário entra na auditoria.
            $user = $lockedProfessional->user;
            if ($user !== null) {
                $user->detachPersonRole(PersonRole::PROFESSIONAL);
                if ($user->hasPersonProfile()) {
                    $user->save();
                } else {
                    $user->delete();
                }
            }
            $lockedProfessional->delete();
            DB::afterCommit(fn () => $this->permissionCache->invalidate());

            // A identidade e a foto permanecem no cadastro central de pessoas.
        });
    }
}

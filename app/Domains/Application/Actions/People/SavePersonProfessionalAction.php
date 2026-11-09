<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\People;

use App\Domains\Application\Data\People\SavePersonData;
use App\Domains\Application\Policies\Auth\AdministratorAccessPolicy;
use App\Domains\Application\Queries\Professionals\ProfessionalHasPendingPendenciesQuery;
use App\Domains\Application\Queries\Professionals\ProfessionalHasSessionsQuery;
use App\Domains\Domain\DTOs\Professionals\CreateProfessionalDTO;
use App\Domains\Domain\DTOs\Professionals\UpdateProfessionalDTO;
use App\Domains\Domain\Enums\Professionals\ProfessionalStatus;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Positions\Position;
use App\Domains\Domain\Models\Professionals\Professional;
use App\Domains\Domain\ValueObjects\Students\Registration;

final readonly class SavePersonProfessionalAction
{
    public function __construct(
        private ProfessionalHasPendingPendenciesQuery $hasPendingPendencies,
        private ProfessionalHasSessionsQuery $hasSessions,
        private AdministratorAccessPolicy $administratorAccess,
    ) {}

    public function execute(Person $person, SavePersonData $data, User $actor): void
    {
        $fields = $data->details['professional'];
        $position = Position::query()->findOrFail($fields['position_id']);
        $position->ensureIsActive();
        $attributes = [
            'registration' => Registration::from($fields['registration']),
            'entryDate' => $fields['entry_date'],
            'status' => ProfessionalStatus::from($fields['status']),
        ];
        $professional = $person->professional;
        if ($professional !== null) {
            if ($professional->status !== $attributes['status'] && $attributes['status'] === ProfessionalStatus::INACTIVE) {
                $professional->ensureCanBeInactivated(
                    hasPendingPendencies: $this->hasPendingPendencies->execute($professional),
                    hasSessions: $this->hasSessions->execute($professional),
                );
                $this->administratorAccess->ensureCanRevokeAccess($actor, $professional->user);
            }
            $professional->revise($position, new UpdateProfessionalDTO(...$attributes));
        } else {
            $professional = Professional::register($person, $position, new CreateProfessionalDTO(...$attributes));
        }
        $professional->showOnWebsite((bool) ($fields['show_on_website'] ?? false));
        $professional->save();
    }
}

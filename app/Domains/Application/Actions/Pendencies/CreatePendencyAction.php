<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Pendencies;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Application\Data\Pendencies\CreatePendencyData;
use App\Domains\Domain\DTOs\Pendencies\CreatePendencyDTO;
use App\Domains\Domain\Exceptions\Pendencies\InvalidPendency;
use App\Domains\Domain\Models\Pendencies\Pendency;
use App\Domains\Infrastructure\Notifications\Pendencies\NewPendencyNotification;
use App\Domains\Domain\Exceptions\Professionals\InvalidProfessional;
use App\Domains\Domain\Models\Professionals\Professional;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreatePendencyAction
{
    /**
     * @throws InvalidPendency
     * @throws InvalidProfessional
     * @throws ModelNotFoundException
     * @throws Throwable
     */
    public function execute(User $creator, CreatePendencyData $data): Pendency
    {
        $pendency = DB::transaction(function () use ($creator, $data): Pendency {
            $professional = Professional::query()
                ->with('person')
                ->findOrFail($data->assignedTo);

            $pendencyDTO = new CreatePendencyDTO(
                title: $data->title,
                priority: $data->priority,
                description: $data->description,
                dueDate: $data->dueDate,
            );

            $pendency = Pendency::register(
                creator: $creator,
                assignedProfessional: $professional,
                data: $pendencyDTO,
            );

            $pendency->save();

            return $pendency->load(['creator.professional.person', 'assignedProfessional.user']);
        });

        $pendency->assignedProfessional?->user?->notify(new NewPendencyNotification($pendency));

        return $pendency;
    }
}

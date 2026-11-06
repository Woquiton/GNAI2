<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Pendencies;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Application\Data\Pendencies\UpdatePendencyData;
use App\Domains\Domain\DTOs\Pendencies\UpdatePendencyDTO;
use App\Domains\Domain\Exceptions\Pendencies\InvalidPendency;
use App\Domains\Domain\Models\Pendencies\Pendency;
use App\Domains\Domain\Exceptions\Professionals\InvalidProfessional;
use App\Domains\Domain\Models\Professionals\Professional;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdatePendencyAction
{
    /**
     * @throws InvalidPendency
     * @throws InvalidProfessional
     * @throws ModelNotFoundException
     * @throws Throwable
     */
    public function execute(Pendency $pendency, UpdatePendencyData $data, User $actor): Pendency
    {
        return DB::transaction(function () use ($pendency, $data, $actor): Pendency {
            $lockedPendency = Pendency::query()
                ->lockForUpdate()
                ->findOrFail($pendency->getKey());
            $lockedPendency->ensureCanBeEditedBy($actor);

            $professional = Professional::query()
                ->with('person')
                ->findOrFail($data->assignedTo);

            $pendencyDTO = new UpdatePendencyDTO(
                title: $data->title,
                priority: $data->priority,
                description: $data->description,
                dueDate: $data->dueDate,
            );

            $lockedPendency->revise(
                assignedProfessional: $professional,
                data: $pendencyDTO,
            );

            $lockedPendency->save();

            return $lockedPendency->load(['creator.professional.person', 'assignedProfessional.person']);
        });
    }
}

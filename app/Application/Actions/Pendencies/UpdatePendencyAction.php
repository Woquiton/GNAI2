<?php

declare(strict_types=1);

namespace App\Application\Actions\Pendencies;

use App\Domains\Auth\Domain\Models\User;
use App\Application\Data\Pendencies\UpdatePendencyData;
use App\Domain\DTOs\Pendencies\UpdatePendencyDTO;
use App\Domain\Exceptions\InvalidPendency;
use App\Domain\Exceptions\InvalidProfessional;
use App\Domain\Models\Pendency;
use App\Domain\Models\Professional;
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

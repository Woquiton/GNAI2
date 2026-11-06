<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Institutions;

use App\Domains\Application\Data\Institutions\CreateInstitutionData;
use App\Domains\Application\Queries\Institutions\InstitutionExistsQuery;
use App\Domains\Domain\DTOs\Institutions\CreateInstitutionDTO;
use App\Domains\Domain\Exceptions\Institutions\InvalidInstitution;
use App\Domains\Domain\Models\Institutions\Institution;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreateInstitutionAction
{
    public function __construct(
        private InstitutionExistsQuery $institutionExists,
    ) {}

    /**
     * @throws InvalidInstitution
     * @throws Throwable
     */
    public function execute(CreateInstitutionData $data): Institution
    {
        return DB::transaction(function () use ($data): Institution {
            $institutionDTO = new CreateInstitutionDTO(
                name: $data->name,
                city: $data->city,
                state: $data->state,
                latitude: $data->latitude,
                longitude: $data->longitude,
                shortName: $data->shortName,
                district: $data->district,
                address: $data->address,
                defaultZoom: $data->defaultZoom,
                isActive: $data->isActive,
            );

            $institution = Institution::register($institutionDTO);

            if ($this->institutionExists->execute($data)) {
                throw new InvalidInstitution('Já existe uma instituição cadastrada.');
            }

            $institution->save();

            return $institution;
        });
    }
}

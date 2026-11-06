<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Items;

use App\Domains\Application\Actions\Inspections\AttachInspectionEvidencesAction;
use App\Domains\Application\Actions\Inspections\CreateInspectionAction;
use App\Domains\Domain\Models\Inspections\Inspection;
use App\Domains\Application\Data\Items\CreateItemData;
use App\Domains\Application\Queries\Items\ItemAssetCodeExistsQuery;
use App\Domains\Domain\DTOs\Items\CreateItemDTO;
use App\Domains\Domain\Exceptions\Items\AssetCodeAlreadyInUse;
use App\Domains\Domain\Models\Items\Item;
use App\Domains\Domain\ValueObjects\Items\AssetCode;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreateItemAction
{
    public function __construct(
        private CreateInspectionAction $createInspection,
        private AttachInspectionEvidencesAction $attachInspectionEvidences,
        private ItemAssetCodeExistsQuery $assetCodeExists,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(CreateItemData $data, int $registeredBy): Item
    {
        $inspection = null;

        $item = DB::transaction(function () use ($data, $registeredBy, &$inspection) {
            $assetCode = AssetCode::optional($data->assetCode);

            if (
                $assetCode !== null
                && $this->assetCodeExists->execute($assetCode)
            ) {
                throw new AssetCodeAlreadyInUse;
            }

            $itemDTO = new CreateItemDTO(
                itemType: $data->itemType,
                name: $data->name,
                isDigital: $data->isDigital,
                isLoanable: $data->isLoanable,
                quantity: $data->quantity,
                assetCode: $assetCode,
                conservationState: $data->conservationState,
                status: $data->status,
                notes: $data->notes,
                isActive: $data->isActive,
            );

            $item = Item::register($itemDTO);

            try {
                $item->save();
            } catch (UniqueConstraintViolationException $exception) {
                throw new AssetCodeAlreadyInUse($exception);
            }

            $item->assignTargetAudience($data->deficiencies);
            $item->assignAccessibilityFeatures($data->accessibilityFeatures);

            $inspection = $this->createInspection->execute(
                inspectable: $item,
                data: $data->inspection,
                registeredBy: $registeredBy,
                state: $data->conservationState->value,
                defaultDescription: 'Vistoria inicial de entrada.',
            );

            return $item;
        });

        if ($inspection instanceof Inspection) {
            $this->attachInspectionEvidences->execute(
                inspection: $inspection,
                evidences: $data->inspection->evidences,
            );
        }

        return $item->fresh([
            'deficiencies',
            'accessibilityFeatures',
            'inspections.evidences',
        ]);
    }
}

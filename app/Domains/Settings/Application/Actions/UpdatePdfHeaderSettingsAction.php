<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Actions;

use App\Domains\Settings\Application\Data\UpdatePdfHeaderSettingsData;
use App\Domains\Settings\Application\Queries\GetPdfHeaderSettingsQuery;
use App\Domains\Settings\Domain\Enums\SettingCategory;
use App\Domains\Settings\Domain\Models\Setting;
use App\Domains\Settings\Domain\ValueObjects\PdfHeaderSettings;
use App\Domains\Settings\Infrastructure\Storage\PdfHeaderLogoStorage;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class UpdatePdfHeaderSettingsAction
{
    public function __construct(
        private PdfHeaderLogoStorage $storage,
        private GetPdfHeaderSettingsQuery $settings,
    ) {}

    public function execute(UpdatePdfHeaderSettingsData $data): void
    {
        $newPath = $data->logo !== null ? $this->storage->store($data->logo) : null;

        try {
            $obsoletePath = DB::transaction(function () use ($data, $newPath): ?string {
                // A trava mantém o arquivo da configuração mais recente durante atualizações simultâneas.
                Setting::query()
                    ->where('category', SettingCategory::PDF->value)
                    ->lockForUpdate()
                    ->first();
                $current = $this->settings->execute();
                $path = $newPath ?? ($data->removeLogo ? null : $current->logoPath);
                $settings = new PdfHeaderSettings(
                    institutionName: $data->institutionName,
                    issuingUnit: $data->issuingUnit,
                    details: $data->details,
                    logoPath: $path,
                    logoHidden: $newPath !== null ? false : ($data->removeLogo || $current->logoHidden),
                    logoShape: $data->logoShape,
                    configured: true,
                );
                Setting::store(SettingCategory::PDF, $settings->toPayload());

                return $current->logoPath !== $path ? $current->logoPath : null;
            });
        } catch (Throwable $exception) {
            $this->storage->delete($newPath);

            throw $exception;
        }

        $this->storage->delete($obsoletePath);
    }
}

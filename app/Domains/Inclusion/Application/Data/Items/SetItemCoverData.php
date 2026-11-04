<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Data\Items;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class SetItemCoverData extends Data
{
    public function __construct(
        public ?int $expectedCoverEvidenceId,
    ) {}

    public static function rules(): array
    {
        return ['expected_cover_evidence_id' => ['present', 'nullable', 'integer']];
    }

    public static function messages(): array
    {
        return [
            'expected_cover_evidence_id.present' => 'Atualize a página para conferir a capa atual.',
            'expected_cover_evidence_id.integer' => 'Informe uma imagem de capa válida.',
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Domains\Settings\Domain\ValueObjects;

final readonly class PdfHeaderSettings
{
    public function __construct(
        public string $institutionName = 'Gnai',
        public ?string $issuingUnit = 'Gestor de Núcleos de Acessibilidade e Inclusão',
        public ?string $details = null,
        public ?string $logoPath = null,
        public bool $logoHidden = false,
        public bool $configured = false,
    ) {}

    /**
     * @param  array<string, mixed>  $payload
     */
    public static function fromPayload(array $payload): self
    {
        return new self(
            institutionName: (string) ($payload['institution_name'] ?? 'Gnai'),
            issuingUnit: $payload['issuing_unit'] ?? null,
            details: $payload['details'] ?? null,
            logoPath: $payload['logo_path'] ?? null,
            logoHidden: (bool) ($payload['logo_hidden'] ?? false),
            configured: true,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toPayload(): array
    {
        return [
            'institution_name' => $this->institutionName,
            'issuing_unit' => $this->issuingUnit,
            'details' => $this->details,
            'logo_path' => $this->logoPath,
            'logo_hidden' => $this->logoHidden,
        ];
    }
}

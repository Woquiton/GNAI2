<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Data\Email;

use App\Domain\Enums\TagModule;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryContext;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Enums\EmailMailboxFolder;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Support\Validation\ValidationContext;

#[MapInputName(SnakeCaseMapper::class)]
final class ListEmailDeliveriesData extends Data
{
    public function __construct(
        public ?string $search = null,
        public ?string $status = null,
        public ?string $context = null,
        public ?string $dateFrom = null,
        public ?string $dateTo = null,
        public int $perPage = 10,
        public string $folder = 'all',
        public ?int $label = null,
    ) {}

    public static function prepareForPipeline(array $properties): array
    {
        foreach ($properties as $key => $value) {
            if (is_string($value)) {
                $properties[$key] = trim($value) === '' ? null : trim($value);
            }
        }

        return $properties;
    }

    public static function rules(ValidationContext $context): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::enum(EmailDeliveryStatus::class)],
            'context' => ['nullable', Rule::enum(EmailDeliveryContext::class)],
            'date_from' => ['nullable', 'date_format:Y-m-d'],
            'date_to' => [
                'nullable', 'date_format:Y-m-d',
                Rule::when(filled($context->payload['date_from'] ?? null), ['after_or_equal:date_from']),
            ],
            'per_page' => ['integer', 'min:1', 'max:100'],
            'folder' => ['sometimes', 'required', Rule::enum(EmailMailboxFolder::class)],
            'label' => ['nullable', 'integer', Rule::exists('tags', 'id')->where('module', TagModule::INBOX->value)],
        ];
    }

    public static function messages(): array
    {
        return [
            'search.max' => 'Informe um assunto com até 255 caracteres.',
            'status.enum' => 'Selecione um status de envio válido.',
            'context.enum' => 'Selecione uma origem válida.',
            'label.integer' => 'Selecione um marcador válido.',
            'label.exists' => 'Selecione uma etiqueta do módulo Inbox.',
            'date_from.date_format' => 'Informe uma data inicial válida.',
            'date_to.date_format' => 'Informe uma data final válida.',
            'date_to.after_or_equal' => 'A data final deve ser igual ou posterior à data inicial.',
            'per_page.integer' => 'Informe uma quantidade inteira de registros por página.',
            'per_page.min' => 'Exiba pelo menos um registro por página.',
            'per_page.max' => 'Exiba no máximo 100 registros por página.',
        ];
    }

    public function toFilters(): array
    {
        return [
            'search' => $this->search ?? '',
            'status' => $this->status ?? '',
            'context' => $this->context ?? '',
            'date_from' => $this->dateFrom ?? '',
            'date_to' => $this->dateTo ?? '',
            'folder' => $this->folder,
            'label' => $this->label !== null ? (string) $this->label : '',
        ];
    }
}

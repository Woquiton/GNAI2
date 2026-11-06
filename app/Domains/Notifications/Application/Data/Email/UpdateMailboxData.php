<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Data\Email;

use App\Domain\Enums\TagModule;
use App\Domains\Notifications\Domain\Enums\EmailMailboxOperation;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

final class UpdateMailboxData extends Data
{
    public function __construct(
        public array $ids,
        public EmailMailboxOperation $operation,
        public ?int $label = null,
    ) {}

    public static function rules(): array
    {
        return [
            'ids' => ['required', 'array', 'min:1', 'max:100'],
            'ids.*' => ['required', 'uuid', 'distinct', 'exists:email_deliveries,id'],
            'operation' => ['required', Rule::enum(EmailMailboxOperation::class)],
            'label' => ['nullable', 'integer', Rule::exists('tags', 'id')->where('module', TagModule::INBOX->value)->where('is_active', true)],
        ];
    }

    public static function messages(): array
    {
        return [
            'label.integer' => 'Selecione uma etiqueta válida.',
            'label.exists' => 'Selecione uma etiqueta ativa do módulo Inbox.',
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Data;

use App\Domains\Settings\Domain\ValueObjects\AutomaticEmailSettings;
use Spatie\LaravelData\Data;

final class UpdateAutomaticEmailSettingsData extends Data
{
    /** @param array<string, bool> $events */
    public function __construct(public array $events) {}

    public static function rules(): array
    {
        $purposes = array_keys(AutomaticEmailSettings::defaults());
        $rules = ['events' => ['required', 'array:'.implode(',', $purposes)]];
        foreach ($purposes as $purpose) {
            $rules['events.'.$purpose] = ['required', 'boolean'];
        }

        return $rules;
    }

    public static function messages(): array
    {
        return [
            'events.required' => 'Informe quais e-mails devem ser enviados automaticamente.',
            'events.array' => 'Informe somente os eventos de envio automático disponíveis.',
            'events.*.required' => 'Escolha se este e-mail deve ser enviado automaticamente.',
            'events.*.boolean' => 'Informe uma opção válida para o envio automático.',
        ];
    }
}

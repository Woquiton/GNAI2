<?php

declare(strict_types=1);

namespace App\Domains\Help\Domain\Enums;

use Illuminate\Support\Str;

/**
 * Categorias da Central de Ajuda, na ordem das abas. Acompanham os grupos da sidebar
 * (`AppNavigation`); o cabeçalho `categoria` dos artigos usa o rótulo.
 */
enum HelpCategory: string
{
    case GETTING_STARTED = 'primeiros-passos';
    case CARE = 'atendimento';
    case PLANS = 'planos-e-acompanhamento';
    case RESOURCES = 'recursos-e-acessibilidade';
    case MANAGEMENT = 'gestao-do-nucleo';
    case COMMUNICATION = 'comunicacao';
    case SYSTEM = 'sistema';

    public function label(): string
    {
        return match ($this) {
            self::GETTING_STARTED => 'Primeiros passos',
            self::CARE => 'Atendimento',
            self::PLANS => 'Planos e acompanhamento',
            self::RESOURCES => 'Recursos e acessibilidade',
            self::MANAGEMENT => 'Gestão do núcleo',
            self::COMMUNICATION => 'Comunicação',
            self::SYSTEM => 'Sistema',
        };
    }

    public function iconClass(): string
    {
        return match ($this) {
            self::GETTING_STARTED => 'ti-flag-alt',
            self::CARE => 'ti-user',
            self::PLANS => 'ti-clipboard',
            self::RESOURCES => 'ti-package',
            self::MANAGEMENT => 'ti-briefcase',
            self::COMMUNICATION => 'ti-announcement',
            self::SYSTEM => 'ti-settings',
        };
    }

    public function position(): int
    {
        return (int) array_search($this, self::cases(), true);
    }

    /** Aceita o rótulo ("Gestão do núcleo") ou o valor ("gestao-do-nucleo"); desconhecidas vão para Sistema. */
    public static function fromHeader(?string $value): self
    {
        return self::tryFrom(Str::slug((string) $value)) ?? self::SYSTEM;
    }
}

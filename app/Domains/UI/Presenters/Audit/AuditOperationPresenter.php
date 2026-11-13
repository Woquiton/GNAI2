<?php

declare(strict_types=1);

namespace App\Domains\UI\Presenters\Audit;

use App\Shared\Infrastructure\Navigation\AppNavigation;
use Illuminate\Support\Str;

final readonly class AuditOperationPresenter
{
    public function __construct(private AppNavigation $navigation) {}

    public function description(string $route): string
    {
        $label = $this->navigation->labelForRoute($route);

        if ($label === null) {
            return 'uma operação do sistema';
        }

        $area = mb_strtolower($label);

        return match (Str::afterLast($route, '.')) {
            'index' => 'a listagem de '.$area,
            'show' => 'os detalhes em '.$area,
            'create' => 'o formulário de cadastro em '.$area,
            'edit' => 'o formulário de edição em '.$area,
            'store' => 'uma operação de cadastro em '.$area,
            'update' => 'uma operação de atualização em '.$area,
            'destroy', 'delete' => 'uma operação de exclusão em '.$area,
            'download' => 'uma operação de download em '.$area,
            'pdf' => 'a geração de PDF em '.$area,
            default => 'a área de '.$area,
        };
    }
}

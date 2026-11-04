<?php

declare(strict_types=1);

namespace App\Domains\Notifications\UI\Presenters;

use App\Domains\Notifications\Domain\Models\EmailDelivery;

final class EmailDeliveryPresenter
{
    public function present(?EmailDelivery $delivery): array
    {
        return [
            'status' => $delivery?->status->value ?? 'not_requested',
            'label' => $delivery?->status->label() ?? 'Sem registro de envio',
            'sent_at_label' => $delivery?->sent_at?->format('d/m/Y H:i'),
        ];
    }
}

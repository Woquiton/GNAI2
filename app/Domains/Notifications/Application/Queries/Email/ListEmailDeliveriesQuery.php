<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Queries\Email;

use App\Domains\Notifications\Application\Data\Email\ListEmailDeliveriesData;
use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class ListEmailDeliveriesQuery
{
    public function execute(ListEmailDeliveriesData $filters): LengthAwarePaginator
    {
        return $this->matching($filters)
            ->when($filters->status, fn (Builder $query, string $status) => $query->where('status', $status))
            ->select([
                'id', 'context_type', 'purpose', 'recipient_email', 'recipient_name', 'subject',
                'status', 'attempts', 'created_at', 'sent_at',
            ])
            ->latest('created_at')
            ->orderByDesc('id')
            ->paginate($filters->perPage)
            ->withQueryString();
    }

    /** Contagens dos mesmos filtros de assunto, origem e período, antes de selecionar um status. */
    public function counts(ListEmailDeliveriesData $filters): array
    {
        $counts = array_fill_keys(array_column(EmailDeliveryStatus::cases(), 'value'), 0);
        $rows = $this->matching($filters)->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')->get();
        foreach ($rows as $row) {
            $counts[$row->status->value] = (int) $row->aggregate;
        }

        return ['all' => array_sum($counts), ...$counts];
    }

    private function matching(ListEmailDeliveriesData $filters): Builder
    {
        $query = EmailDelivery::query();
        if ($filters->search !== null) {
            $query->where('subject', 'like', '%'.addcslashes($filters->search, '\\%_').'%');
        }
        if ($filters->context !== null) {
            $query->where('context_type', $filters->context);
        }
        if ($filters->dateFrom !== null) {
            $query->where('created_at', '>=', CarbonImmutable::parse($filters->dateFrom)->startOfDay());
        }
        if ($filters->dateTo !== null) {
            $query->where('created_at', '<', CarbonImmutable::parse($filters->dateTo)->addDay()->startOfDay());
        }

        return $query;
    }
}

<?php

declare(strict_types=1);

namespace App\Infrastructure\Reporting;

use App\Domain\Enums\ItemType;
use App\Domain\Enums\WaitlistStatus;
use App\Domain\Models\Item;
use App\Domain\Models\Waitlist;
use App\Domains\Reporting\Domain\Enums\ReportColumnType;
use Illuminate\Database\Eloquent\Builder;

final class WaitlistsReportSource extends OperationReportSource
{
    public function key(): string
    {
        return 'inclusive-radar.waitlists';
    }

    public function label(): string
    {
        return 'Listas de espera';
    }

    protected function model(): string
    {
        return Waitlist::class;
    }

    protected function with(): array
    {
        return ['waitlistable', 'student.person', 'professional.person', 'user'];
    }

    protected function definitions(): array
    {
        return [
            'notified_at' => ['label' => 'Notificado em', 'type' => ReportColumnType::DATE],
            'fulfilled_at' => ['label' => 'Atendido em', 'type' => ReportColumnType::DATE],
            'cancelled_at' => ['label' => 'Cancelado em', 'type' => ReportColumnType::DATE],
            'origin_semester' => $this->semesterDefinition(),
            'item_type' => [
                'label' => 'Tipo de recurso',
                'path' => 'waitlistable.item_type',
                'type' => ReportColumnType::SELECT,
                'options' => ItemType::options(),
            ],
            'waitlistable' => ['label' => 'Recurso', 'path' => 'waitlistable.name'],
            'student' => ['label' => 'Aluno', 'path' => 'student.person.name'],
            'professional' => ['label' => 'Profissional', 'path' => 'professional.person.name'],
            'requested_at' => ['label' => 'Solicitado em', 'type' => ReportColumnType::DATE],
            'status' => ['label' => 'Situação', 'type' => ReportColumnType::SELECT, 'options' => $this->enumOptions(WaitlistStatus::class)],
            'observation' => ['label' => 'Observação'], 'registered_by' => ['label' => 'Registrado por', 'path' => 'user.name'],
        ];
    }

    protected function filterable(): array
    {
        return ['notified_at', 'fulfilled_at', 'cancelled_at', 'origin_semester', 'item_type', 'student', 'professional', 'requested_at', 'status', 'registered_by'];
    }

    public function applyFilter(Builder $query, string $field, string $operator, mixed $value): void
    {
        if ($field !== 'item_type') {
            parent::applyFilter($query, $field, $operator, $value);

            return;
        }

        // O tipo fica no item: relações MorphTo exigem whereHasMorph em vez de whereHas.
        $query->whereHasMorph(
            'waitlistable',
            [Item::class],
            static fn (Builder $item): Builder => $item->where('item_type', $operator, $value),
        );
    }
}

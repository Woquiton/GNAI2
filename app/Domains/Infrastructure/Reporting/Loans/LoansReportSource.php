<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\Loans;

use App\Domains\Domain\Enums\Items\ItemType;
use App\Domains\Domain\Models\Items\Item;
use App\Domains\Domain\Enums\Loans\LoanStatus;
use App\Domains\Domain\Models\Loans\Loan;
use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Infrastructure\Reporting\Reporting\OperationReportSource;
use Illuminate\Database\Eloquent\Builder;

final class LoansReportSource extends OperationReportSource
{
    public function key(): string
    {
        return 'inclusive-radar.loans';
    }

    public function label(): string
    {
        return 'Empréstimos';
    }

    protected function model(): string
    {
        return Loan::class;
    }

    protected function with(): array
    {
        return ['loanable', 'student.person', 'professional.person', 'user'];
    }

    protected function definitions(): array
    {
        return [
            'origin_semester' => $this->semesterDefinition(),
            'item_type' => [
                'label' => 'Tipo de recurso',
                'path' => 'loanable.item_type',
                'type' => ReportColumnType::SELECT,
                'options' => ItemType::options(),
            ],
            'loanable' => ['label' => 'Recurso', 'path' => 'loanable.name'],
            'student' => ['label' => 'Aluno', 'path' => 'student.person.name'],
            'professional' => ['label' => 'Profissional', 'path' => 'professional.person.name'],
            'loan_date' => ['label' => 'Emprestado em', 'type' => ReportColumnType::DATE],
            'due_date' => ['label' => 'Devolução prevista', 'type' => ReportColumnType::DATE],
            'return_date' => ['label' => 'Devolvido em', 'type' => ReportColumnType::DATE],
            'status' => ['label' => 'Situação', 'type' => ReportColumnType::SELECT, 'options' => $this->enumOptions(LoanStatus::class)],
            'observation' => ['label' => 'Observação'], 'registered_by' => ['label' => 'Registrado por', 'path' => 'user.name'],
        ];
    }

    protected function filterable(): array
    {
        return ['origin_semester', 'item_type', 'student', 'professional', 'loan_date', 'due_date', 'return_date', 'status', 'registered_by'];
    }

    public function applyFilter(Builder $query, string $field, string $operator, mixed $value): void
    {
        if ($field !== 'item_type') {
            parent::applyFilter($query, $field, $operator, $value);

            return;
        }

        // O tipo fica no item: relações MorphTo exigem whereHasMorph em vez de whereHas.
        $query->whereHasMorph(
            'loanable',
            [Item::class],
            static fn (Builder $item): Builder => $item->where('item_type', $operator, $value),
        );
    }
}

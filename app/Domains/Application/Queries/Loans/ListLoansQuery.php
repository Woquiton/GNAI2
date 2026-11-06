<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Loans;

use App\Domains\Application\Data\Loans\ListLoansData;
use App\Domains\Domain\Models\Loans\Loan;
use App\Domains\Application\Queries\Semesters\OperationsInSemesterQuery;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class ListLoansQuery
{
    /**
     * @return LengthAwarePaginator<int, Loan>
     */
    public function execute(ListLoansData $filters): LengthAwarePaginator
    {
        $query = Loan::query()
            ->with([
                'loanable',
                'confirmationEmail:id,context_id,status,sent_at',
                'returnEmail:id,context_id,status,sent_at',
                'student:id,person_id,registration',
                'student.person:id,name',
                'professional:id,person_id,registration',
                'professional.person:id,name',
                'user:id,name',
                'semester',
            ]);

        if (filled($filters->student)) {
            $term = trim($filters->student);

            $query->whereHas(
                'student.person',
                static fn (Builder $query): Builder => $query->where('name', 'like', "%{$term}%"),
            );
        }

        if (filled($filters->professional)) {
            $term = trim($filters->professional);

            $query->whereHas(
                'professional.person',
                static fn (Builder $query): Builder => $query->where('name', 'like', "%{$term}%"),
            );
        }

        if (filled($filters->item)) {
            $term = trim($filters->item);

            $query->whereHasMorph(
                'loanable',
                ['*'],
                static fn (Builder $query): Builder => $query->where('name', 'like', "%{$term}%"),
            );
        }

        if ($filters->status !== null) {
            $query->where('status', $filters->status);
        }

        if ($filters->semesterId !== null) {
            app(OperationsInSemesterQuery::class)->apply($query, $filters->semesterId, $filters->semesterMode);
        }

        return $query
            ->orderByDesc('loan_date')
            ->orderByDesc('id')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}

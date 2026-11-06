<?php

declare(strict_types=1);

namespace App\Application\Queries\Waitlists;

use App\Application\Data\Waitlists\ListWaitlistsData;
use App\Application\Queries\Semesters\OperationsInSemesterQuery;
use App\Domain\Models\Waitlist;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class ListWaitlistsQuery
{
    /**
     * @return LengthAwarePaginator<int, Waitlist>
     */
    public function execute(ListWaitlistsData $filters): LengthAwarePaginator
    {
        $query = Waitlist::query()
            ->with([
                'waitlistable',
                'registrationEmail:id,context_id,status,sent_at',
                'student:id,person_id,registration',
                'student.person:id,name',
                'professional:id,person_id,registration',
                'professional.person:id,name',
                'user:id,name',
                'semester',
            ]);

        if (filled($filters->item)) {
            $term = trim($filters->item);

            $query->whereHasMorph(
                'waitlistable',
                ['*'],
                static fn (Builder $query): Builder => $query->where('name', 'like', "%{$term}%"),
            );
        }

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

        if ($filters->status !== null) {
            $query->where('status', $filters->status->value);
        }

        if ($filters->startDate !== null && $filters->endDate !== null) {
            $query->whereBetween('requested_at', [$filters->startDate, $filters->endDate]);
        }

        if ($filters->semesterId !== null) {
            app(OperationsInSemesterQuery::class)->apply($query, $filters->semesterId, $filters->semesterMode);
        }

        return $query
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}

<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\SupportRequests;

use App\Domains\Application\Data\SupportRequests\ListSupportRequestsData;
use App\Domains\Domain\Models\SupportRequests\SupportRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListSupportRequestsQuery
{
    public function execute(ListSupportRequestsData $filters): LengthAwarePaginator
    {
        return SupportRequest::query()->with(['student.person', 'creator.professional.person', 'creator.teacher.person'])
            ->when($filters->search, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('requester_name', 'like', "%{$search}%")
                        ->orWhereHas('student.person', fn ($query) => $query->where('name', 'like', "%{$search}%"));
                    $protocol = ltrim($search, '#');
                    if (ctype_digit($protocol)) {
                        $query->orWhere('id', (int) $protocol);
                    }
                });
            })
            ->when($filters->status, fn ($query, $status) => $query->where('status', $status))
            ->when($filters->studentId, fn ($query, $studentId) => $query->where('student_id', $studentId))
            ->orderByDesc('request_date')->orderByDesc('id')
            ->paginate($filters->perPage)->withQueryString();
    }
}

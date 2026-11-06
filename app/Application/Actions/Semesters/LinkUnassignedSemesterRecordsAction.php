<?php

declare(strict_types=1);

namespace App\Application\Actions\Semesters;

use App\Application\Queries\Semesters\SemesterForDateQuery;
use App\Domain\Models\Barrier;
use App\Domain\Models\Inspection;
use App\Domain\Models\Loan;
use App\Domain\Models\OperationStatusChange;
use App\Domain\Models\Pendency;
use App\Domain\Models\Publication;
use App\Domain\Models\Semester;
use App\Domain\Models\Session;
use App\Domain\Models\SupportRequest;
use App\Domain\Models\Waitlist;

final readonly class LinkUnassignedSemesterRecordsAction
{
    public function __construct(private SemesterForDateQuery $semesterForDate) {}

    /** Somente vínculos ausentes com data comprovável; os vínculos já existentes ficam intactos. */
    public function execute(Semester $semester): void
    {
        if ($semester->start_date === null || $semester->end_date === null) {
            return;
        }

        foreach ([Loan::class, Waitlist::class, Session::class, SupportRequest::class, Pendency::class, Barrier::class, Inspection::class, Publication::class, OperationStatusChange::class] as $model) {
            $date = $model === OperationStatusChange::class ? 'occurred_at' : $model::SEMESTER_DATE;
            $model::query()->whereNull('semester_id')
                ->where($date, '>=', $semester->start_date->startOfDay())
                ->where($date, '<', $semester->end_date->copy()->addDay()->startOfDay())
                ->orderBy('id')->lockForUpdate()->chunkById(200, function ($records) use ($date, $semester): void {
                    foreach ($records as $record) {
                        if ($this->semesterForDate->execute($record->getAttribute($date)) === (int) $semester->getKey()) {
                            $record->forceFill(['semester_id' => $semester->getKey()])->save();
                        }
                    }
                });
        }
    }
}

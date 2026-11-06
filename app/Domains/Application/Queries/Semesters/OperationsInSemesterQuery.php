<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Semesters;

use App\Domains\Domain\Models\Semesters\Semester;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\ValidationException;

final class OperationsInSemesterQuery
{
    /** Consulta cronológica é distinta do vínculo persistido de origem. */
    public function apply(Builder $query, string $semesterId, string $mode = 'origin'): void
    {
        if ($mode === 'origin') {
            if ($semesterId === 'unassigned') {
                $query->whereNull($query->getModel()->qualifyColumn('semester_id'));
            } else {
                $query->where($query->getModel()->qualifyColumn('semester_id'), $semesterId);
            }

            return;
        }

        $semester = Semester::query()->find($semesterId);
        if ($semester?->start_date === null || $semester->end_date === null) {
            throw ValidationException::withMessages(['semester_id' => 'Selecione um semestre com datas de início e término para consultar movimentações.']);
        }
        $start = $semester->start_date->startOfDay();
        $end = $semester->end_date->copy()->addDay()->startOfDay();
        $table = $query->getModel()->getTable();
        $date = $query->getModel()->qualifyColumn($query->getModel()::SEMESTER_DATE);

        if ($mode === 'scheduled' && $table === 'publications') {
            $query->where('has_schedule', true)->where('start_date', '<', $end)
                ->where(fn (Builder $part) => $part->where('end_date', '>=', $start->toDateString())
                    ->orWhere(fn (Builder $singleDay) => $singleDay->whereNull('end_date')->where('start_date', '>=', $start->toDateString())));

            return;
        }

        if ($mode === 'started') {
            $query->where($date, '>=', $start)->where($date, '<', $end);

            return;
        }

        if ($mode === 'ended') {
            $columns = match ($table) {
                'loans' => ['return_date'],
                'waitlists' => ['fulfilled_at', 'cancelled_at'],
                'pendencies' => ['completed_at'],
                default => [],
            };
            if ($columns === []) {
                throw ValidationException::withMessages(['semester_mode' => 'Este registro não possui encerramento consultável por este filtro.']);
            }
            $query->where(function (Builder $nested) use ($columns, $table, $start, $end): void {
                foreach ($columns as $column) {
                    $nested->orWhere(fn (Builder $part) => $part->where("{$table}.{$column}", '>=', $start)->where("{$table}.{$column}", '<', $end));
                }
            });

            return;
        }

        $query->where($date, '<', $end);
        match ($table) {
            'loans' => $query->where(fn (Builder $part) => $part->whereNull('return_date')->orWhere('return_date', '>', $start)),
            'waitlists' => $query->where(function (Builder $part) use ($start): void {
                $part->whereIn('status', ['waiting', 'notified'])
                    ->orWhere('fulfilled_at', '>', $start)
                    ->orWhere('cancelled_at', '>', $start);
            }),
            'pendencies' => $query->where(fn (Builder $part) => $part->where('is_completed', false)->orWhere('completed_at', '>', $start)),
            default => throw ValidationException::withMessages(['semester_mode' => 'Este registro não possui intervalo consultável por este filtro.']),
        };
    }
}

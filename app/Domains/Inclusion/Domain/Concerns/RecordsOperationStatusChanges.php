<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Domain\Concerns;

use App\Domains\Inclusion\Application\Queries\Semesters\SemesterForDateQuery;
use App\Domains\Inclusion\Domain\Models\OperationStatusChange;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait RecordsOperationStatusChanges
{
    private bool $operationWasNew = false;

    /** O registro e sua transição são gravados na mesma transação, inclusive fora de actions. */
    public function save(array $options = [])
    {
        return $this->getConnection()->transaction(fn () => parent::save($options));
    }

    public static function bootRecordsOperationStatusChanges(): void
    {
        static::saving(function ($record): void {
            $record->operationWasNew = ! $record->exists;
        });

        static::saved(function ($record): void {
            foreach (static::HISTORY_FIELDS as $field) {
                if (! $record->operationWasNew && ! $record->wasChanged($field)) {
                    continue;
                }

                $before = $record->operationWasNew ? null : $record->getRawOriginal($field);
                $after = $record->getAttributes()[$field] ?? null;
                if ($before === null && $after === null) {
                    continue;
                }

                // Datas efetivas conhecidas prevalecem sobre a data de lançamento.
                $dateField = match ($field) {
                    'status' => match ($record->getTable()) {
                        'loans' => $record->return_date !== null ? 'return_date' : ($record->operationWasNew ? 'loan_date' : null),
                        'waitlists' => match ($after) {
                            'notified' => 'notified_at',
                            'fulfilled' => 'fulfilled_at',
                            'cancelled' => 'cancelled_at',
                            default => $record->operationWasNew ? 'requested_at' : null,
                        },
                        default => null,
                    },
                    'is_completed' => $after ? 'completed_at' : null,
                    'resolved_at' => $after !== null ? 'resolved_at' : null,
                    default => null,
                };
                $occurredAt = $dateField !== null ? $record->getAttribute($dateField) : null;
                $occurredAt ??= $record->operationWasNew && $record->getTable() !== 'attendance_sessions'
                    ? ($record->getAttribute(static::SEMESTER_DATE) ?? now())
                    : now();

                $record->statusChanges()->create([
                    'record_type' => $record->getTable(),
                    'field' => $field,
                    'from_value' => $before === null ? null : (is_bool($before) ? (string) (int) $before : (string) $before),
                    'to_value' => $after === null ? null : (is_bool($after) ? (string) (int) $after : (string) $after),
                    'occurred_at' => $occurredAt,
                    'recorded_at' => now(),
                    'actor_id' => auth()->id(),
                    'semester_id' => app(SemesterForDateQuery::class)->execute($occurredAt),
                ]);
            }
        });
    }

    public function statusChanges(): HasMany
    {
        return $this->hasMany(OperationStatusChange::class, 'record_id')
            ->where('record_type', $this->getTable());
    }
}

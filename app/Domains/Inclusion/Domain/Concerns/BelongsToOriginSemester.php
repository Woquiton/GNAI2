<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Domain\Concerns;

use App\Domains\Inclusion\Application\Queries\Semesters\SemesterForDateQuery;
use App\Domains\Inclusion\Domain\Models\Semester;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** O contexto é persistido; a virada ou a edição do calendário não o reatribui. */
trait BelongsToOriginSemester
{
    public static function bootBelongsToOriginSemester(): void
    {
        static::saving(function ($record): void {
            $field = static::SEMESTER_DATE;

            if (! $record->exists || $record->isDirty($field)) {
                $date = $record->getAttribute($field);
                if ($field === 'created_at' && ! $record->exists && $date === null) {
                    $date = now();
                    $record->setAttribute($field, $date);
                }

                $record->setAttribute('semester_id', app(SemesterForDateQuery::class)->execute($date));
                $record->unsetRelation('semester');
            }
        });
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }
}

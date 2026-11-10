<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\PeiDisciplines;

use App\Domains\Application\Queries\Peis\TeacherPeiAccessQuery;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\PeiDisciplines\PeiDiscipline;
use App\Domains\Infrastructure\Notifications\PeiDisciplines\PeiDisciplineNotification;

final readonly class NotifyPeiDisciplineChangeAction
{
    public function __construct(private TeacherPeiAccessQuery $access) {}

    public function execute(PeiDiscipline $record, User $actor, bool $firstTeacherChange): void
    {
        if ($actor->teacher_id === null || (int) $actor->teacher_id !== (int) $record->teacher_id
            || (int) $actor->getKey() === (int) $record->creator_id) {
            return;
        }

        $recipient = $record->creator;
        if ($recipient === null || ! $recipient->can('pei-discipline.view') || ! $this->access->canView($record->pei, $recipient)) {
            return;
        }

        // Canal database, na mesma transação da revisão: rollback também desfaz o aviso.
        $recipient->notify(new PeiDisciplineNotification($record, $firstTeacherChange ? 'first_fill' : 'updated'));
    }
}

<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Teachers;

use App\Domains\Application\Queries\Auth\UserHasAuthoredPedagogicalRecordsQuery;
use App\Domains\Domain\Exceptions\Teachers\InvalidTeacher;
use App\Domains\Domain\Models\Teachers\Teacher;
use App\Domains\Infrastructure\Storage\Teachers\TeacherPhotoStorage;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeleteTeacherAction
{
    public function __construct(
        private TeacherPhotoStorage $photoStorage,
        private UserHasAuthoredPedagogicalRecordsQuery $hasAuthoredPedagogicalRecords,
    ) {}

    /**
     * @throws Throwable
     */
    public function execute(Teacher $teacher): void
    {
        $photoPath = DB::transaction(function () use ($teacher): ?string {
            $lockedTeacher = Teacher::query()
                ->with('person')
                ->lockForUpdate()
                ->findOrFail($teacher->getKey());

            if ($lockedTeacher->peiDisciplines()->exists()) {
                throw new InvalidTeacher(
                    'Não é possível excluir este professor pois ele possui registros de acompanhamento em Planos Educacionais Individualizados (PEI).'
                );
            }

            $userId = $lockedTeacher->user()->value('id');

            if ($this->hasAuthoredPedagogicalRecords->execute($userId === null ? null : (int) $userId)) {
                throw new InvalidTeacher(
                    'Não é possível excluir este professor pois o usuário dele é autor de registros de PEI, PAEE ou estudo de caso.'
                );
            }

            $person = $lockedTeacher->person;
            $photoPath = $person?->getRawOriginal('photo');

            // Um registro por vez (a cascata do banco não passa pela auditoria).
            $lockedTeacher->courseDisciplines()->get()->each->delete();
            $lockedTeacher->user?->delete();
            $lockedTeacher->delete();
            $person?->delete();

            return $photoPath;
        });

        $this->photoStorage->delete($photoPath);
    }
}

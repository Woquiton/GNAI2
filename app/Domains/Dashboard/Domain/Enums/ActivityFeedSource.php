<?php

declare(strict_types=1);

namespace App\Domains\Dashboard\Domain\Enums;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domain\Models\AeeStudentEvaluation;
use App\Domain\Models\CaseStudy;
use App\Domain\Models\Paee;
use App\Domain\Models\PedagogicalRecord;
use App\Domain\Models\PeiDiscipline;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Documentos do AEE que aparecem nas atividades recentes do painel, lidas do histórico de auditoria.
 * Cada valor é o `auditType()` do model: para incluir um documento, ele precisa ser auditável.
 */
enum ActivityFeedSource: string
{
    case CASE_STUDY = 'case_study';
    case PAEE = 'paee';
    case PEI_DISCIPLINE = 'pei_discipline';
    case AEE_STUDENT_EVALUATION = 'aee_student_evaluation';
    case PEDAGOGICAL_RECORD = 'pedagogical_record';

    /** @return list<string> */
    public static function types(): array
    {
        return array_map(fn (self $source): string => $source->value, self::cases());
    }

    /** @return class-string<Model&Auditable> */
    public function modelClass(): string
    {
        return match ($this) {
            self::CASE_STUDY => CaseStudy::class,
            self::PAEE => Paee::class,
            self::PEI_DISCIPLINE => PeiDiscipline::class,
            self::AEE_STUDENT_EVALUATION => AeeStudentEvaluation::class,
            self::PEDAGOGICAL_RECORD => PedagogicalRecord::class,
        };
    }

    public function label(): string
    {
        return $this->modelClass()::auditLabel();
    }

    /** Permissão exigida para o item do feed virar link. */
    public function ability(): string
    {
        return match ($this) {
            self::CASE_STUDY => 'case-study.view',
            self::PAEE => 'paee.view',
            self::PEI_DISCIPLINE => 'pei-discipline.view',
            self::AEE_STUDENT_EVALUATION => 'aee-record.view',
            self::PEDAGOGICAL_RECORD => 'pedagogical-record.view',
        };
    }

    /** Tela de visualização do documento. */
    public function url(Model $entity): string
    {
        $prefix = 'specialized-educational-support.';

        return match ($this) {
            self::CASE_STUDY => route($prefix.'case-study.show', $entity),
            self::PAEE => route($prefix.'paee.show', $entity),
            self::PEI_DISCIPLINE => route($prefix.'pei-discipline.show', [$entity->getAttribute('pei_id'), $entity]),
            self::AEE_STUDENT_EVALUATION => route(
                $prefix.'students.aee-records.show',
                [$entity->getAttribute('student_id'), $entity],
            ),
            self::PEDAGOGICAL_RECORD => route($prefix.'pedagogical-records.show', $entity),
        };
    }

    /**
     * Ids dos documentos destes alunos, como gravados no histórico, para o feed de quem só vê os próprios alunos.
     *
     * @param  list<int>  $studentIds
     * @return list<string>
     */
    public function entityIdsOfStudents(array $studentIds): array
    {
        if ($studentIds === []) {
            return [];
        }

        $query = match ($this) {
            self::CASE_STUDY => CaseStudy::query()->whereIn('student_id', $studentIds),
            self::PAEE => Paee::query()->whereIn('student_id', $studentIds),
            self::PEI_DISCIPLINE => PeiDiscipline::query()
                ->whereHas('pei', fn (Builder $pei) => $pei->whereIn('student_id', $studentIds)),
            self::AEE_STUDENT_EVALUATION => AeeStudentEvaluation::query()
                ->withTrashed()
                ->whereIn('student_id', $studentIds),
            self::PEDAGOGICAL_RECORD => PedagogicalRecord::query()
                ->withTrashed()
                ->whereHas('attendanceSession.students', fn (Builder $students) => $students->whereIn('students.id', $studentIds)),
        };

        return $query->pluck('id')->map(fn (mixed $id): string => (string) $id)->all();
    }
}

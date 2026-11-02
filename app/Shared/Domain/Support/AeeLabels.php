<?php

declare(strict_types=1);

namespace App\Shared\Domain\Support;

final class AeeLabels
{
    public const DEMAND_ORIGINS = [
        'teacher' => 'Professor',
        'family' => 'Família',
        'student' => 'Estudante',
        'medical_report' => 'Laudo médico',
        'other' => 'Outro',
    ];

    public const CASE_STUDY_STATUSES = [
        'completed' => 'Concluído',
        'in_progress' => 'Em andamento',
        'draft' => 'Rascunho',
    ];

    public const PAEE_STATUSES = [
        'active' => 'Ativo',
        'under_review' => 'Em revisão',
        'draft' => 'Rascunho',
    ];

    public const ACCEPTANCE_STATUSES = [
        'accepted' => 'Aceito',
        'declined' => 'Recusado',
        'not_applicable' => 'Não aplicável',
    ];

    public const NEEDED_SUPPORTS = [
        'locomotion' => 'Locomoção',
        'hygiene' => 'Higiene',
        'feeding' => 'Alimentação',
        'communication' => 'Comunicação',
        'interaction' => 'Interação social',
        'assistive_technology' => 'Tecnologia assistiva',
        'libras' => 'Libras',
        'guide_interpreter' => 'Guia-intérprete',
        'orientation_mobility' => 'Orientação e mobilidade',
        'none' => 'Nenhum',
    ];

    public const BARRIER_TYPES = [
        'architectural' => 'Arquitetônica',
        'urbanistic' => 'Urbanística',
        'transport' => 'Transporte',
        'communicational' => 'Comunicacional',
        'methodological' => 'Metodológica',
        'technological' => 'Tecnológica',
        'attitudinal' => 'Atitudinal',
        'social' => 'Social',
    ];

    public const ATTENDANCE_FORMATS = [
        'individual' => 'Individual',
        'collective' => 'Coletivo',
        'mixed' => 'Misto',
    ];

    public const ATTENDANCE_LOCATIONS = [
        'srm' => 'Sala de Recursos Multifuncionais (SRM)',
        'common_classroom' => 'Sala de aula comum',
        'accessibility_center' => 'Centro de acessibilidade',
        'other' => 'Outro',
    ];

    public const OBJECTIVE_TERMS = [
        'short' => 'Curto prazo',
        'medium' => 'Médio prazo',
        'long' => 'Longo prazo',
    ];

    public const ACQUISITION_TYPES = [
        'to_produce' => 'A produzir',
        'to_accessibilize' => 'A acessibilizar',
        'to_acquire' => 'A adquirir',
    ];

    public static function demandOrigin(?string $value): string
    {
        return self::fromMap($value, self::DEMAND_ORIGINS);
    }

    public static function caseStudyStatus(?string $value): string
    {
        return self::fromMap($value, self::CASE_STUDY_STATUSES);
    }

    public static function paeeStatus(?string $value): string
    {
        return self::fromMap($value, self::PAEE_STATUSES);
    }

    public static function acceptanceStatus(?string $value): string
    {
        return self::fromMap($value, self::ACCEPTANCE_STATUSES);
    }

    public static function neededSupport(?string $value): string
    {
        return self::fromMap($value, self::NEEDED_SUPPORTS);
    }

    /** @param list<string>|null $values */
    public static function neededSupportsList(?array $values): string
    {
        return collect($values ?? [])
            ->map(fn (string $value): string => self::neededSupport($value))
            ->implode(', ');
    }

    public static function barrierType(?string $value): string
    {
        return self::fromMap($value, self::BARRIER_TYPES);
    }

    public static function attendanceFormat(?string $value): string
    {
        return self::fromMap($value, self::ATTENDANCE_FORMATS);
    }

    public static function attendanceLocation(?string $value): string
    {
        return self::fromMap($value, self::ATTENDANCE_LOCATIONS);
    }

    public static function objectiveTerm(?string $value): string
    {
        return self::fromMap($value, self::OBJECTIVE_TERMS);
    }

    public static function acquisitionType(?string $value): string
    {
        return self::fromMap($value, self::ACQUISITION_TYPES);
    }

    /** @param array<string, string> $map */
    private static function fromMap(?string $value, array $map): string
    {
        if ($value === null) {
            return '—';
        }

        return $map[$value] ?? $value;
    }
}

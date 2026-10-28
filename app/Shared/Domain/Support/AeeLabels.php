<?php

declare(strict_types=1);

namespace App\Shared\Domain\Support;

final class AeeLabels
{
    public static function demandOrigin(?string $value): string
    {
        return self::fromMap($value, [
            'teacher' => 'Professor',
            'family' => 'Família',
            'student' => 'Estudante',
            'medical_report' => 'Laudo médico',
            'other' => 'Outro',
        ]);
    }

    public static function caseStudyStatus(?string $value): string
    {
        return self::fromMap($value, [
            'completed' => 'Concluído',
            'in_progress' => 'Em andamento',
            'draft' => 'Rascunho',
        ]);
    }

    public static function paeeStatus(?string $value): string
    {
        return self::fromMap($value, [
            'active' => 'Ativo',
            'under_review' => 'Em revisão',
            'draft' => 'Rascunho',
        ]);
    }

    public static function acceptanceStatus(?string $value): string
    {
        return self::fromMap($value, [
            'accepted' => 'Aceito',
            'declined' => 'Recusado',
            'not_applicable' => 'Não aplicável',
        ]);
    }

    public static function neededSupport(?string $value): string
    {
        return self::fromMap($value, [
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
        ]);
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
        return self::fromMap($value, [
            'architectural' => 'Arquitetônica',
            'urbanistic' => 'Urbanística',
            'transport' => 'Transporte',
            'communicational' => 'Comunicacional',
            'methodological' => 'Metodológica',
            'technological' => 'Tecnológica',
            'attitudinal' => 'Atitudinal',
            'social' => 'Social',
        ]);
    }

    public static function attendanceFormat(?string $value): string
    {
        return self::fromMap($value, [
            'individual' => 'Individual',
            'collective' => 'Coletivo',
            'mixed' => 'Misto',
        ]);
    }

    public static function attendanceLocation(?string $value): string
    {
        return self::fromMap($value, [
            'srm' => 'Sala de Recursos Multifuncionais (SRM)',
            'common_classroom' => 'Sala de aula comum',
            'accessibility_center' => 'Centro de acessibilidade',
            'other' => 'Outro',
        ]);
    }

    public static function objectiveTerm(?string $value): string
    {
        return self::fromMap($value, [
            'short' => 'Curto prazo',
            'medium' => 'Médio prazo',
            'long' => 'Longo prazo',
        ]);
    }

    public static function acquisitionType(?string $value): string
    {
        return self::fromMap($value, [
            'to_produce' => 'A produzir',
            'to_accessibilize' => 'A acessibilizar',
            'to_acquire' => 'A adquirir',
        ]);
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

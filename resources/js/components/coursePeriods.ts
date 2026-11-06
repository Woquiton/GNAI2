import type { FieldOption } from '@/components/Forms/FormFields/FormFields';

/** Rótulo de um período do curso (semestre ou série): `3` vira "3º período". */
export function coursePeriodLabel(period: number | string | null | undefined): string {
    const value = Number(period);

    return Number.isInteger(value) && value > 0 ? `${value}º período` : 'Sem período definido';
}

/**
 * Opções do período do curso, de 1 até o máximo aceito pelo backend. A primeira opção, de valor vazio,
 * representa "sem período", para que o campo continue opcional e possa ser limpo.
 */
export function coursePeriodOptions(max: number): FieldOption[] {
    return [
        { value: '', label: 'Sem período definido' },
        ...Array.from({ length: max }, (_, index) => ({
            value: String(index + 1),
            label: coursePeriodLabel(index + 1),
        })),
    ];
}

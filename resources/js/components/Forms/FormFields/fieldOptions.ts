import type { FieldOption } from './FormFields.types';

/**
 * Converte o mapa `valor => rótulo` enviado pelos controllers em opções de select.
 * `omitEmpty` remove a entrada vazia que alguns enums enviam como "Todos"/"Selecione".
 */
export function optionsFromRecord(
    record: Record<string, string>,
    { omitEmpty = false }: { omitEmpty?: boolean } = {},
): FieldOption[] {
    return Object.entries(record)
        .filter(([value]) => !omitEmpty || value !== '')
        .map(([value, label]) => ({ value, label }));
}

/** Converte registros `{ id, name }` em opções, mantendo o tipo do identificador. */
export function optionsFromNamed<T extends string | number>(
    records: ReadonlyArray<{ id: T; name: string }>,
): FieldOption<T>[] {
    return records.map((record) => ({ value: record.id, label: record.name }));
}

/** Opções de filtros booleanos enviados como `'1'`/`'0'`. */
export function booleanOptions(trueLabel: string, falseLabel: string): FieldOption[] {
    return [
        { value: '1', label: trueLabel },
        { value: '0', label: falseLabel },
    ];
}

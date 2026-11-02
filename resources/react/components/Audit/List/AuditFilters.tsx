import { DateInputField, SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import type { AuditFilters as AuditFilterValues, AuditOptions } from '../Audit.types';
import { isFilterDate } from '../Audit.utils';

interface AuditFiltersProps {
    values: AuditFilterValues;
    options: AuditOptions;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof AuditFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function AuditFilters({
    values,
    options,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: AuditFiltersProps): React.JSX.Element {
    const hasFilters = Object.values(values).some((value) => value !== '');

    function updateDate(name: 'date_from' | 'date_to', value: string): void {
        if (isFilterDate(value) && value !== values[name]) {
            onUpdate(name, value);
        }
    }

    const moreFilters = (
        <>
            <SelectInputField
                id="audit-filter-type"
                name="type"
                label="Tipo de registro"
                placeholder="Todos"
                options={options.types}
                value={values.type}
                error={errors.type}
                onChange={(value) => onUpdate('type', value)}
            />
            <SelectInputField
                id="audit-filter-event"
                name="event"
                label="Ação"
                placeholder="Todas"
                options={options.events}
                value={values.event}
                error={errors.event}
                onChange={(value) => onUpdate('event', value)}
            />
        </>
    );

    return (
        <TableListFilters
            label="Filtrar histórico de alterações"
            moreFilters={moreFilters}
            clearDisabled={!hasFilters}
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="audit-filter-search"
                name="search"
                label="O que você procura?"
                maxLength={100}
                placeholder="Ex.: nome do aluno, sessão #12, nome de quem alterou"
                value={values.search}
                error={errors.search}
                onChange={(value) => onUpdate('search', value)}
            />
            <DateInputField
                id="audit-filter-date-from"
                name="date_from"
                label="De"
                value={values.date_from}
                error={errors.date_from}
                onChange={(value) => updateDate('date_from', value)}
            />
            <DateInputField
                id="audit-filter-date-to"
                name="date_to"
                label="Até"
                value={values.date_to}
                error={errors.date_to}
                onChange={(value) => updateDate('date_to', value)}
            />
            <SelectInputField
                id="audit-filter-actor"
                name="actor"
                label="Quem fez"
                placeholder="Todos"
                options={options.actors}
                value={values.actor}
                error={errors.actor}
                onChange={(value) => onUpdate('actor', value)}
            />
        </TableListFilters>
    );
}

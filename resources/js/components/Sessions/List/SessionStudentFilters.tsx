import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { SelectInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import useAutoListFilters from '@/hooks/useAutoListFilters';
import { emptySessionStudentFilters, pickSessionStudentFilters } from '../Sessions.constants';
import type {
    SessionListFilters,
    SessionListOptions,
    SessionStudentFilterValues,
} from '../Sessions.types';

interface SessionStudentFiltersProps {
    filters: SessionListFilters;
    options: SessionListOptions;
    onSearch: (values: SessionStudentFilterValues) => void;
}

/** Filtros da listagem de agendamentos do aluno: profissional, tipo e status. */
export default function SessionStudentFilters({
    filters,
    options,
    onSearch,
}: SessionStudentFiltersProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const initialValues = useMemo(() => pickSessionStudentFilters(filters), [filters]);
    const { values, update, clear, submit } = useAutoListFilters({
        initialValues,
        emptyValues: emptySessionStudentFilters,
        onSearch,
    });

    return (
        <TableListFilters label="Filtrar agendamentos" onSubmit={submit} onClear={clear}>
            <SelectInputField
                id="session-filter-professional"
                name="professional"
                label="Profissional"
                placeholder="Profissional (Todos)"
                value={values.professional}
                options={options.professionals ?? []}
                error={errors.professional}
                onChange={(value) => update('professional', value)}
            />
            <SelectInputField
                id="session-filter-type"
                name="type"
                label="Tipo"
                placeholder="Tipo (Todos)"
                value={values.type}
                options={options.types}
                error={errors.type}
                onChange={(value) => update('type', value)}
            />
            <SelectInputField
                id="session-filter-status"
                name="status"
                label="Status"
                placeholder="Status (Todos)"
                value={values.status}
                options={options.statuses}
                error={errors.status}
                onChange={(value) => update('status', value)}
            />
        </TableListFilters>
    );
}

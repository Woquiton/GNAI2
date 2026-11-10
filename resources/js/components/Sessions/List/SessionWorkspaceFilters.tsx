import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { DateInputField, SelectInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import useAutoListFilters from '@/hooks/useAutoListFilters';
import { emptySessionWorkspaceFilters, pickSessionWorkspaceFilters } from '../Sessions.constants';
import type {
    SessionListFilters,
    SessionListOptions,
    SessionWorkspaceFilterValues,
} from '../Sessions.types';

interface SessionWorkspaceFiltersProps {
    filters: SessionListFilters;
    options: SessionListOptions;
    showProfessional?: boolean;
    onSearch: (values: SessionWorkspaceFilterValues) => void;
}

/** Filtros compartilhados pelo calendário e pela listagem de agendamentos. */
export default function SessionWorkspaceFilters({
    filters,
    options,
    showProfessional = true,
    onSearch,
}: SessionWorkspaceFiltersProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const initialValues = useMemo(() => pickSessionWorkspaceFilters(filters), [filters]);
    const emptyValues = useMemo(() => emptySessionWorkspaceFilters(), []);
    const { values, update, clear, submit } = useAutoListFilters({
        initialValues,
        emptyValues,
        onSearch,
    });

    function updateReferenceDay(value: string): void {
        if (value !== values.week) {
            update('week', value);
        }
    }

    return (
        <TableListFilters
            moreFilters={
                <>
                    <SelectInputField
                        id="session-filter-type"
                        name="type"
                        label="Tipo"
                        placeholder="Todos os Tipos"
                        value={values.type}
                        options={options.types}
                        error={errors.type}
                        onChange={(value) => update('type', value)}
                    />
                    <SelectInputField
                        id="session-filter-status"
                        name="status"
                        label="Status"
                        placeholder="Todos os Status"
                        value={values.status}
                        options={options.statuses}
                        error={errors.status}
                        onChange={(value) => update('status', value)}
                    />
                </>
            }
            label="Filtrar calendário e listagem de agendamentos"
            onSubmit={submit}
            onClear={clear}
        >
            <DateInputField
                id="session-filter-reference-day"
                name="week"
                label="Dia de referência"
                value={values.week}
                error={errors.week}
                onChange={updateReferenceDay}
            />
            <SelectInputField
                id="session-filter-student"
                name="student"
                label="Aluno"
                placeholder="Todos os Alunos"
                value={values.student}
                options={options.students ?? []}
                error={errors.student}
                onChange={(value) => update('student', value)}
            />
            {showProfessional ? (
                <SelectInputField
                    id="session-filter-professional"
                    name="professional"
                    label="Professor"
                    placeholder="Todos os Professores"
                    value={values.professional}
                    options={options.professionals ?? []}
                    error={errors.professional}
                    onChange={(value) => update('professional', value)}
                />
            ) : null}
        </TableListFilters>
    );
}

import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { pendencyStatusOptions } from '../Pendencies.constants';
import type {
    PendencyListFilters,
    PendencyListOption,
    PendencyPriorityOption,
} from '../Pendencies.types';

interface PendencyFiltersProps {
    values: PendencyListFilters;
    priorities: PendencyPriorityOption[];
    /** Filtro por profissional, somente na listagem geral. */
    professionals?: PendencyListOption[];
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof PendencyListFilters, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

function priorityOptions(priorities: PendencyPriorityOption[]): PendencyListOption[] {
    return priorities.map(({ value, label }) => ({ value, label }));
}

export default function PendencyFilters({
    values,
    priorities,
    professionals,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: PendencyFiltersProps): React.JSX.Element {
    return (
        <TableListFilters
            moreFilters={
                <>
                    <SelectInputField
                        id="pendency-filter-priority"
                        name="priority"
                        label="Prioridade"
                        placeholder="Todas"
                        options={priorityOptions(priorities)}
                        value={values.priority}
                        error={errors.priority}
                        onChange={(value) => onUpdate('priority', value)}
                    />
                    <SelectInputField
                        id="pendency-filter-status"
                        name="is_completed"
                        label="Status"
                        placeholder="Todos"
                        options={pendencyStatusOptions}
                        value={values.is_completed}
                        error={errors.is_completed}
                        onChange={(value) => onUpdate('is_completed', value)}
                    />
                </>
            }
            label="Filtrar pendências"
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="pendency-filter-title"
                name="title"
                label="Título"
                maxLength={255}
                placeholder="Buscar por título..."
                value={values.title}
                error={errors.title}
                onChange={(value) => onUpdate('title', value)}
            />
            {professionals ? (
                <SelectInputField
                    id="pendency-filter-professional"
                    name="assigned_to"
                    label="Profissional"
                    placeholder="Todos"
                    options={professionals}
                    value={values.assigned_to}
                    error={errors.assigned_to}
                    onChange={(value) => onUpdate('assigned_to', value)}
                />
            ) : null}
        </TableListFilters>
    );
}

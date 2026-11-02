import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { barrierPriorityOptions, barrierStatusOptions } from '../Barriers.constants';
import type { BarrierFilters as BarrierFilterValues } from '../Barriers.types';

interface BarrierFiltersProps {
    values: BarrierFilterValues;
    onUpdate: (name: keyof BarrierFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function BarrierFilters({
    values,
    onUpdate,
    onClear,
    onSubmit,
}: BarrierFiltersProps): React.JSX.Element {
    return (
        <TableListFilters label="Filtrar barreiras" onClear={onClear} onSubmit={onSubmit}>
            <TextInputField
                id="barrier-filter-name"
                name="name"
                label="Nome da barreira"
                maxLength={255}
                placeholder="Filtrar por nome da barreira..."
                value={values.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <TextInputField
                id="barrier-filter-category"
                name="category"
                label="Categoria"
                maxLength={255}
                placeholder="Filtrar por categoria..."
                value={values.category}
                onChange={(value) => onUpdate('category', value)}
            />
            <SelectInputField
                id="barrier-filter-priority"
                name="priority"
                label="Prioridade"
                placeholder="Todas"
                options={barrierPriorityOptions}
                value={values.priority}
                onChange={(value) => onUpdate('priority', value)}
            />
            <SelectInputField
                id="barrier-filter-status"
                name="status"
                label="Status"
                placeholder="Todos"
                options={barrierStatusOptions}
                value={values.status}
                onChange={(value) => onUpdate('status', value)}
            />
        </TableListFilters>
    );
}

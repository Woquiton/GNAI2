import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import { usePage } from '@inertiajs/react';
import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
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
    const errors = usePage().props.errors as Record<string, string | undefined>;
    return (
        <TableListFilters
            moreFilters={
                <>
                    <TextInputField
                        id="barriers-filter-institution_name"
                        name="institution_name"
                        label="Instituição"
                        maxLength={255}
                        value={values.institution_name}
                        error={errors.institution_name}
                        onChange={(value) => onUpdate('institution_name', value)}
                    />
                    <TextInputField
                        id="barriers-filter-location_name"
                        name="location_name"
                        label="Ponto de referência"
                        maxLength={255}
                        value={values.location_name}
                        error={errors.location_name}
                        onChange={(value) => onUpdate('location_name', value)}
                    />
                    <SelectInputField
                        id="barriers-filter-is_active"
                        name="is_active"
                        label="Registro ativo"
                        placeholder="Todos"
                        options={booleanOptions('Sim', 'Não')}
                        value={values.is_active}
                        error={errors.is_active}
                        onChange={(value) => onUpdate('is_active', value)}
                    />
                    <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
                </>
            }
            label="Filtrar barreiras"
            onClear={onClear}
            onSubmit={onSubmit}
        >
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

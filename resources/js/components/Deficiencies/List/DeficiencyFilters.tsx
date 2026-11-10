import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { deficiencyStatusOptions } from '../Deficiencies.constants';
import type { DeficiencyFilters as FilterValues } from '../Deficiencies.types';

interface DeficiencyFiltersProps {
    values: FilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof FilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function DeficiencyFilters({
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: DeficiencyFiltersProps): React.JSX.Element {
    return (
        <TableListFilters
            moreFilters={
                <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
            }
            label="Filtrar perfis de atendimento"
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="deficiency-filter-name"
                name="name"
                label="Nome"
                maxLength={255}
                placeholder="Nome..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <TextInputField
                id="deficiency-filter-cid"
                name="cid_code"
                label="Código CID"
                maxLength={20}
                placeholder="Código CID..."
                value={values.cid_code}
                error={errors.cid_code}
                onChange={(value) => onUpdate('cid_code', value)}
            />
            <SelectInputField
                id="deficiency-filter-status"
                name="is_active"
                label="Status"
                placeholder="Todos"
                options={deficiencyStatusOptions}
                value={values.is_active}
                error={errors.is_active}
                onChange={(value) => onUpdate('is_active', value)}
            />
        </TableListFilters>
    );
}

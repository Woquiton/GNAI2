import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { tagStatusOptions } from '../Tags.constants';
import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import type { TagFilters as FilterValues } from '../Tags.types';

interface TagFiltersProps {
    values: FilterValues;
    modules: Record<string, string>;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof FilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function TagFilters({
    values,
    modules,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: TagFiltersProps): React.JSX.Element {
    return (
        <TableListFilters
            moreFilters={
                <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
            }
            label="Filtrar etiquetas"
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="tag-filter-name"
                name="name"
                label="Nome"
                maxLength={100}
                placeholder="Filtrar por nome..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <SelectInputField
                id="tag-filter-module"
                name="module"
                label="Módulo"
                placeholder="Todos"
                options={optionsFromRecord(modules)}
                value={values.module}
                error={errors.module}
                onChange={(value) => onUpdate('module', value)}
            />
            <SelectInputField
                id="tag-filter-status"
                name="is_active"
                label="Status"
                placeholder="Todos"
                options={tagStatusOptions}
                value={values.is_active}
                error={errors.is_active}
                onChange={(value) => onUpdate('is_active', value)}
            />
        </TableListFilters>
    );
}

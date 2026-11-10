import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { institutionStatusOptions } from '../Institutions.constants';
import type { InstitutionFilters as InstitutionFilterValues } from '../Institutions.types';

interface InstitutionFiltersProps {
    values: InstitutionFilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof InstitutionFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function InstitutionFilters({
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: InstitutionFiltersProps): React.JSX.Element {
    return (
        <TableListFilters
            moreFilters={
                <>
                    <TextInputField
                        id="institutions-filter-short_name"
                        name="short_name"
                        label="Sigla / nome curto"
                        maxLength={255}
                        value={values.short_name}
                        error={errors.short_name}
                        onChange={(value) => onUpdate('short_name', value)}
                    />
                    <TextInputField
                        id="institutions-filter-district"
                        name="district"
                        label="Bairro / distrito"
                        maxLength={255}
                        value={values.district}
                        error={errors.district}
                        onChange={(value) => onUpdate('district', value)}
                    />
                    <SelectInputField
                        id="institutions-filter-has_barriers"
                        name="has_barriers"
                        label="Barreiras vinculadas"
                        placeholder="Todos"
                        options={booleanOptions('Sim', 'Não')}
                        value={values.has_barriers}
                        error={errors.has_barriers}
                        onChange={(value) => onUpdate('has_barriers', value)}
                    />
                    <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
                </>
            }
            label="Filtrar instituições"
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="institution-filter-name"
                name="name"
                label="Nome da Instituição"
                maxLength={255}
                placeholder="Filtrar por nome..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <TextInputField
                id="institution-filter-location"
                name="location"
                label="Cidade ou Estado"
                maxLength={255}
                placeholder="Filtrar por cidade ou estado..."
                value={values.location}
                error={errors.location}
                onChange={(value) => onUpdate('location', value)}
            />
            <SelectInputField
                id="institution-filter-status"
                name="is_active"
                label="Status"
                placeholder="Todos"
                options={institutionStatusOptions}
                value={values.is_active}
                error={errors.is_active}
                onChange={(value) => onUpdate('is_active', value)}
            />
        </TableListFilters>
    );
}

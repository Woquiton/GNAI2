import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import type { GuardianFilters as GuardianFilterValues } from '../Guardians.types';

interface GuardianFiltersProps {
    values: GuardianFilterValues;
    relationships: Record<string, string>;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof GuardianFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function GuardianFilters({
    values,
    relationships,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: GuardianFiltersProps): React.JSX.Element {
    return (
        <TableListFilters
            moreFilters={
                <>
                    <TextInputField
                        id="guardians-filter-phone"
                        name="phone"
                        label="Telefone"
                        maxLength={255}
                        value={values.phone}
                        error={errors.phone}
                        onChange={(value) => onUpdate('phone', value)}
                    />
                    <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
                </>
            }
            label="Filtrar responsáveis"
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="guardian-filter-name"
                name="name"
                label="Nome do responsável"
                maxLength={255}
                placeholder="Nome do responsável..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <TextInputField
                id="guardian-filter-email"
                name="email"
                label="E-mail"
                maxLength={255}
                placeholder="E-mail..."
                value={values.email}
                error={errors.email}
                onChange={(value) => onUpdate('email', value)}
            />
            <SelectInputField
                id="guardian-filter-relationship"
                name="relationship"
                label="Parentesco"
                placeholder="Todos"
                options={optionsFromRecord(relationships)}
                value={values.relationship}
                error={errors.relationship}
                onChange={(value) => onUpdate('relationship', value)}
            />
        </TableListFilters>
    );
}

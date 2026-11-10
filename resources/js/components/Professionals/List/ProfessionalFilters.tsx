import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
import { booleanOptions, optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import type { ProfessionalFilters as ProfessionalFilterValues } from '../Professionals.types';

interface ProfessionalFiltersProps {
    values: ProfessionalFilterValues;
    positions: Array<{ id: number; name: string }>;
    professionalStatuses: Record<string, string>;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof ProfessionalFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function ProfessionalFilters({
    values,
    positions,
    professionalStatuses,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: ProfessionalFiltersProps): React.JSX.Element {
    const positionOptions = positions.map((position) => ({
        value: String(position.id),
        label: position.name,
    }));
    const moreFilters = (
        <>
            <TextInputField
                id="professional-filter-email"
                name="email"
                label="E-mail"
                maxLength={255}
                placeholder="E-mail..."
                value={values.email}
                error={errors.email}
                onChange={(value) => onUpdate('email', value)}
            />
            <TextInputField
                id="professional-filter-registration"
                name="registration"
                label="Matrícula"
                maxLength={50}
                placeholder="Matrícula..."
                value={values.registration}
                error={errors.registration}
                onChange={(value) => onUpdate('registration', value)}
            />
        </>
    );

    return (
        <TableListFilters
            label="Filtrar profissionais"
            moreFilters={
                <>
                    {moreFilters}
                    <TextInputField
                        id="professionals-filter-phone"
                        name="phone"
                        label="Telefone"
                        maxLength={255}
                        value={values.phone}
                        error={errors.phone}
                        onChange={(value) => onUpdate('phone', value)}
                    />
                    <SelectInputField
                        id="professionals-filter-show_on_website"
                        name="show_on_website"
                        label="Exibido no site"
                        placeholder="Todos"
                        options={booleanOptions('Sim', 'Não')}
                        value={values.show_on_website}
                        error={errors.show_on_website}
                        onChange={(value) => onUpdate('show_on_website', value)}
                    />
                    <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
                </>
            }
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="professional-filter-name"
                name="name"
                label="Nome do profissional"
                maxLength={255}
                placeholder="Nome do profissional..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <SelectInputField
                id="professional-filter-position"
                name="position"
                label="Cargo"
                placeholder="Todos"
                options={positionOptions}
                value={values.position}
                error={errors.position}
                onChange={(value) => onUpdate('position', value)}
            />
            <SelectInputField
                id="professional-filter-status"
                name="status"
                label="Status"
                placeholder="Todos"
                options={optionsFromRecord(professionalStatuses)}
                value={values.status}
                error={errors.status}
                onChange={(value) => onUpdate('status', value)}
            />
        </TableListFilters>
    );
}

import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
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
            moreFilters={moreFilters}
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

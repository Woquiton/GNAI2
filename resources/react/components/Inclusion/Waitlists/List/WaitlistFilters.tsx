import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { waitlistStatusOptions } from '../Waitlists.constants';
import type { WaitlistFilters as WaitlistFilterValues } from '../Waitlists.types';

interface WaitlistFiltersProps {
    values: WaitlistFilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof WaitlistFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function WaitlistFilters({
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: WaitlistFiltersProps): React.JSX.Element {
    const moreFilters = (
        <SelectInputField
            id="waitlist-status-filter"
            name="status"
            label="Status"
            placeholder="Todos"
            options={waitlistStatusOptions}
            value={values.status}
            error={errors.status}
            onChange={(value) => onUpdate('status', value)}
        />
    );

    return (
        <TableListFilters
            label="Filtrar fila de espera"
            moreFilters={moreFilters}
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="waitlist-item-filter"
                name="item"
                label="Item"
                maxLength={255}
                placeholder="Filtrar por item..."
                value={values.item}
                error={errors.item}
                onChange={(value) => onUpdate('item', value)}
            />
            <TextInputField
                id="waitlist-student-filter"
                name="student"
                label="Aluno"
                maxLength={255}
                placeholder="Filtrar por aluno..."
                value={values.student}
                error={errors.student}
                onChange={(value) => onUpdate('student', value)}
            />
            <TextInputField
                id="waitlist-professional-filter"
                name="professional"
                label="Profissional"
                maxLength={255}
                placeholder="Filtrar por profissional..."
                value={values.professional}
                error={errors.professional}
                onChange={(value) => onUpdate('professional', value)}
            />
        </TableListFilters>
    );
}

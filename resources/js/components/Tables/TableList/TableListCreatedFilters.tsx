import { useId } from 'react';
import { DateInputField } from '@/components/Forms/FormFields/FormFields';

interface TableListCreatedFiltersProps {
    values: { created_from: string; created_to: string };
    errors: Record<string, string | undefined>;
    onUpdate: (name: 'created_from' | 'created_to', value: string) => void;
}

/** Período inclusivo de cadastro, compartilhado pelas listagens de registros. */
export default function TableListCreatedFilters({
    values,
    errors,
    onUpdate,
}: TableListCreatedFiltersProps): React.JSX.Element {
    const id = useId();

    return (
        <>
            <DateInputField
                id={`${id}-created-from`}
                name="created_from"
                label="Cadastrado a partir de"
                value={values.created_from}
                error={errors.created_from}
                onChange={(value) => onUpdate('created_from', value)}
            />
            <DateInputField
                id={`${id}-created-to`}
                name="created_to"
                label="Cadastrado até"
                value={values.created_to}
                error={errors.created_to}
                onChange={(value) => onUpdate('created_to', value)}
            />
        </>
    );
}

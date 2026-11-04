import {
    DateInputField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import type { EmailFilters as FilterValues, EmailIndexProps } from '../Emails.types';

interface EmailFiltersProps {
    values: FilterValues;
    statusOptions: EmailIndexProps['statusOptions'];
    contextOptions: EmailIndexProps['contextOptions'];
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof FilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function EmailFilters({
    values,
    statusOptions,
    contextOptions,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: EmailFiltersProps): React.JSX.Element {
    const moreFilters = (
        <>
            <SelectInputField
                id="email-status"
                name="status"
                label="Status"
                placeholder="Todos"
                options={optionsFromRecord(statusOptions)}
                value={values.status}
                error={errors.status}
                onChange={(value) => onUpdate('status', value)}
            />
            <DateInputField
                id="email-date-from"
                name="date_from"
                label="Registrado a partir de"
                value={values.date_from}
                error={errors.date_from}
                onChange={(value) => onUpdate('date_from', value)}
            />
            <DateInputField
                id="email-date-to"
                name="date_to"
                label="Registrado até"
                value={values.date_to}
                error={errors.date_to}
                onChange={(value) => onUpdate('date_to', value)}
            />
        </>
    );

    return (
        <TableListFilters
            label="Filtrar e-mails"
            moreFilters={moreFilters}
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="email-search"
                name="search"
                label="Assunto"
                placeholder="Pesquisar por assunto..."
                maxLength={255}
                value={values.search}
                error={errors.search}
                onChange={(value) => onUpdate('search', value)}
            />
            <SelectInputField
                id="email-context"
                name="context"
                label="Origem"
                placeholder="Todas"
                options={optionsFromRecord(contextOptions)}
                value={values.context}
                error={errors.context}
                onChange={(value) => onUpdate('context', value)}
            />
        </TableListFilters>
    );
}

import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import type {
    SupportRequestFilters as Filters,
    SupportRequestOption,
} from '../SupportRequests.types';

export default function SupportRequestFilters({
    values,
    statuses,
    students,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: {
    values: Filters;
    statuses: SupportRequestOption[];
    students: SupportRequestOption[];
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof Filters, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}): React.JSX.Element {
    return (
        <TableListFilters label="Filtrar solicitações" onClear={onClear} onSubmit={onSubmit}>
            <TextInputField
                id="support-request-search"
                name="search"
                label="Buscar"
                placeholder="Aluno, solicitante ou protocolo"
                value={values.search}
                error={errors.search}
                onChange={(value) => onUpdate('search', value)}
            />
            <SelectInputField
                id="support-request-filter-status"
                name="status"
                label="Situação"
                options={[{ value: '', label: 'Todas' }, ...statuses]}
                value={values.status}
                error={errors.status}
                onChange={(value) => onUpdate('status', value)}
            />
            <SelectInputField
                id="support-request-filter-student"
                name="student_id"
                label="Aluno"
                options={[{ value: '', label: 'Todos' }, ...students]}
                value={values.student_id}
                error={errors.student_id}
                onChange={(value) => onUpdate('student_id', value)}
            />
        </TableListFilters>
    );
}

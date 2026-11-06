import OperationSemesterFilters, {
    type SemesterOption,
} from '@/components/Semesters/OperationSemesterFilters';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { loanStatusOptions } from '../Loans.constants';
import type { LoanFilters as LoanFilterValues } from '../Loans.types';

interface LoanFiltersProps {
    semesters: SemesterOption[];
    values: LoanFilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof LoanFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function LoanFilters({
    semesters,
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: LoanFiltersProps): React.JSX.Element {
    const moreFilters = (
        <>
            <SelectInputField
                id="loan-status-filter"
                name="status"
                label="Status"
                placeholder="Todos"
                options={loanStatusOptions}
                value={values.status}
                error={errors.status}
                onChange={(value) => onUpdate('status', value)}
            />
            <OperationSemesterFilters
                idPrefix="loan"
                semesters={semesters}
                semesterId={values.semester_id}
                mode={values.semester_mode}
                activeLabel="Em uso durante o período"
                errors={errors}
                onSemesterChange={(value) => onUpdate('semester_id', value)}
                onModeChange={(value) => onUpdate('semester_mode', value)}
            />
        </>
    );

    return (
        <TableListFilters
            label="Filtrar empréstimos"
            moreFilters={moreFilters}
            onClear={onClear}
            onSubmit={onSubmit}
        >
            <TextInputField
                id="loan-item-filter"
                name="item"
                label="Item"
                maxLength={255}
                placeholder="Filtrar por item..."
                value={values.item}
                error={errors.item}
                onChange={(value) => onUpdate('item', value)}
            />
            <TextInputField
                id="loan-student-filter"
                name="student"
                label="Estudante"
                maxLength={255}
                placeholder="Filtrar por estudante..."
                value={values.student}
                error={errors.student}
                onChange={(value) => onUpdate('student', value)}
            />
            <TextInputField
                id="loan-professional-filter"
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

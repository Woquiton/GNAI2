import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import type {
    StudentDocumentFilters as StudentDocumentFilterValues,
    StudentDocumentIndexProps,
} from '../StudentDocuments.types';

type StudentDocumentFiltersProps = Pick<StudentDocumentIndexProps, 'types' | 'semesters'> & {
    values: StudentDocumentFilterValues;
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof StudentDocumentFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
};

export default function StudentDocumentFilters({
    types,
    semesters,
    values,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: StudentDocumentFiltersProps): React.JSX.Element {
    return (
        <TableListFilters label="Filtrar documentos" onClear={onClear} onSubmit={onSubmit}>
            <TextInputField
                id="student-document-filter-title"
                name="title"
                label="Título"
                maxLength={255}
                placeholder="Buscar por título..."
                value={values.title}
                error={errors.title}
                onChange={(value) => onUpdate('title', value)}
            />
            <SelectInputField
                id="student-document-filter-type"
                name="type"
                label="Tipo"
                placeholder="Todos"
                options={types}
                value={values.type}
                error={errors.type}
                onChange={(value) => onUpdate('type', value)}
            />
            <SelectInputField
                id="student-document-filter-semester"
                name="semester_id"
                label="Semestre"
                placeholder="Todos"
                options={semesters}
                value={values.semester_id}
                error={errors.semester_id}
                onChange={(value) => onUpdate('semester_id', value)}
            />
        </TableListFilters>
    );
}

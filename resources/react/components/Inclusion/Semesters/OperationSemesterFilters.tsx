import { SelectInputField } from '@/components/Forms/FormFields/FormFields';

export interface SemesterOption {
    id: number;
    label: string;
}

interface OperationSemesterFiltersProps {
    idPrefix: string;
    semesters: SemesterOption[];
    semesterId: string;
    mode: string;
    activeLabel: string;
    errors: Record<string, string | undefined>;
    onSemesterChange: (value: string) => void;
    onModeChange: (value: string) => void;
}

/** Origem acadêmica e movimentação no calendário são consultas diferentes. */
export default function OperationSemesterFilters({
    idPrefix,
    semesters,
    semesterId,
    mode,
    activeLabel,
    errors,
    onSemesterChange,
    onModeChange,
}: OperationSemesterFiltersProps): React.JSX.Element {
    return (
        <>
            <SelectInputField
                id={`${idPrefix}-semester`}
                name="semester_id"
                label="Semestre"
                placeholder="Todos"
                options={[
                    ...semesters.map((semester) => ({
                        value: String(semester.id),
                        label: semester.label,
                    })),
                    { value: 'unassigned', label: 'Sem vínculo: revisar calendário' },
                ]}
                value={semesterId}
                error={errors.semester_id}
                onChange={(value) => {
                    onSemesterChange(value);
                    if (value === 'unassigned') onModeChange('origin');
                }}
            />
            <SelectInputField
                id={`${idPrefix}-semester-mode`}
                name="semester_mode"
                label="Consultar no semestre"
                options={[
                    { value: 'origin', label: 'Semestre de origem' },
                    { value: 'started', label: 'Iniciados no período' },
                    { value: 'active', label: activeLabel },
                    { value: 'ended', label: 'Encerrados no período' },
                ]}
                value={mode}
                disabled={!semesterId || semesterId === 'unassigned'}
                error={errors.semester_mode}
                onChange={onModeChange}
            />
        </>
    );
}

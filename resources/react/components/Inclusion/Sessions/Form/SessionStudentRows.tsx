import FieldError from '@/components/Forms/FormField/FieldError';
import FormField from '@/components/Forms/FormField/FormField';
import type { FieldOption } from '@/components/Forms/FormFields/FormFields';
import SelectField from '@/components/Forms/SelectField/SelectField';
import Button from '@/components/UI/Button/Button';
import type { SessionFormSectionProps } from './SessionForm.types';

interface SessionStudentRowsProps extends SessionFormSectionProps {
    studentOptions: FieldOption[];
    /** Chaves estáveis das linhas; a posição continua definindo `student_ids.N`. */
    rowKeys: number[];
    canAdd: boolean;
    onChange: (index: number, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
}

/** Alunos participantes: um select por aluno, com inclusão em grupo e remoção por linha. */
export default function SessionStudentRows({
    form,
    errors,
    disabled,
    studentOptions,
    rowKeys,
    canAdd,
    onChange,
    onAdd,
    onRemove,
}: SessionStudentRowsProps): React.JSX.Element {
    const firstStudentId = `session-student-${rowKeys[0]}`;
    const removable = rowKeys.length > 1;

    return (
        <FormField
            id={firstStudentId}
            label="Alunos Participantes"
            requiredIndicator
            error={errors.student_ids}
        >
            <div className="sessionForm__students">
                {rowKeys.map((key, index) => {
                    const rowId = `session-student-${key}`;
                    const rowError = errors[`student_ids.${index}`];
                    const describedIds =
                        [
                            index === 0 && errors.student_ids
                                ? `${firstStudentId}-error`
                                : undefined,
                            rowError ? `${rowId}-row-error` : undefined,
                        ]
                            .filter(Boolean)
                            .join(' ') || undefined;

                    return (
                        <div key={key} className="sessionForm__studentRow">
                            <div className="sessionForm__studentSelect">
                                <SelectField
                                    id={rowId}
                                    name="student_ids[]"
                                    label={`Aluno participante ${index + 1}`}
                                    required
                                    disabled={disabled}
                                    value={form.data.student_ids[index] ?? ''}
                                    options={studentOptions}
                                    aria-invalid={Boolean(rowError || errors.student_ids)}
                                    aria-describedby={describedIds}
                                    onChange={(event) => onChange(index, event.target.value)}
                                />
                                <FieldError id={`${rowId}-row`} error={rowError} />
                            </div>
                            {removable ? (
                                <Button
                                    tone="danger"
                                    leftIconClass="fa fa-trash"
                                    label="Remover"
                                    title={`Remover aluno participante ${index + 1}`}
                                    aria-label={`Remover aluno participante ${index + 1}`}
                                    disabled={disabled}
                                    onClick={() => onRemove(index)}
                                />
                            ) : null}
                        </div>
                    );
                })}
                {canAdd ? (
                    <div>
                        <Button
                            tone="success"
                            size="sm"
                            leftIconClass="fa fa-plus"
                            label="Adicionar outro Aluno"
                            disabled={disabled}
                            onClick={onAdd}
                        />
                    </div>
                ) : null}
            </div>
        </FormField>
    );
}

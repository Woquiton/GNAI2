import FormSection from '@/components/Forms/FormSection/FormSection';
import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import type { AeeGuardiansByStudent } from '../AeeRecords.types';
import AeeEvaluationTabs, {
    AeeEvaluationTabIcon,
    AeeEvaluationTabLabel,
    AeeEvaluationTitle,
} from '../AeeEvaluationTabs';
import AeeEvaluationFields from './AeeEvaluationFields';
import type {
    AeeEvaluationFormData,
    AeeEvaluationTab,
    AeeEvaluationTextField,
} from './AeeRecordForm.types';

interface AeeRecordEvaluationFieldsProps {
    editing: boolean;
    students: AeeEvaluationTab[];
    evaluations: AeeEvaluationFormData[];
    guardiansByStudent: AeeGuardiansByStudent;
    tabFocus: { id?: string; version: number };
    collectionErrors: string[];
    disabled: boolean;
    /** Texto sem alunos; o padrão descreve o agendamento sem alunos vinculados. */
    emptyMessage?: string;
    errorFor: (index: number, field: string) => string | undefined;
    hasErrors: (index: number) => boolean;
    onChange: (index: number, changes: Partial<AeeEvaluationFormData>) => void;
    /** Recebe a chave aninhada do campo (`evaluations.0.recommendations`) e seu rótulo. */
    onEditorFailure: (field: string, label: string) => void;
}

/** Uma aba por aluno, sinalizando ausência e avaliações com campos a corrigir. */
export default function AeeRecordEvaluationFields({
    editing,
    students,
    evaluations,
    guardiansByStudent,
    tabFocus,
    collectionErrors,
    disabled,
    emptyMessage = 'Nenhum aluno vinculado a este agendamento.',
    errorFor,
    hasErrors,
    onChange,
    onEditorFailure,
}: AeeRecordEvaluationFieldsProps): React.JSX.Element {
    const title = editing ? 'Editar Avaliação Individual' : 'Avaliação Individual por Aluno';

    const tabs: TabItem[] = students.map((student, index) => {
        const evaluation = evaluations[index];
        const absent = evaluation ? !evaluation.is_present : false;
        const invalid = hasErrors(index);
        const states = [absent ? 'ausente' : null, invalid ? 'com campos a corrigir' : null].filter(
            Boolean,
        );

        return {
            id: student.key,
            accessibleLabel: states.length ? `${student.name} (${states.join(', ')})` : undefined,
            label: (
                <AeeEvaluationTabLabel name={student.name}>
                    {absent ? <AeeEvaluationTabIcon iconClass="fa fa-user-times" /> : null}
                    {invalid ? <AeeEvaluationTabIcon iconClass="fa fa-exclamation-circle" /> : null}
                </AeeEvaluationTabLabel>
            ),
            content: evaluation ? (
                <>
                    <AeeEvaluationTitle studentName={student.name} />
                    {/* As abas reutilizam o painel: a `key` remonta os editores por aluno. */}
                    <AeeEvaluationFields
                        key={student.key}
                        idPrefix={`aee-evaluation-${index}`}
                        namePrefix={`evaluations[${index}]`}
                        values={evaluation}
                        guardians={guardiansByStudent[student.studentId] ?? []}
                        errorFor={(field) => errorFor(index, field)}
                        disabled={disabled}
                        onPresenceChange={(present) => onChange(index, { is_present: present })}
                        onGuardiansChange={(changes) => onChange(index, changes)}
                        onFieldChange={(field: AeeEvaluationTextField, value) => {
                            const changes: Partial<AeeEvaluationFormData> = {};
                            changes[field] = value;
                            onChange(index, changes);
                        }}
                        onEditorFailure={(field, label) =>
                            onEditorFailure(`evaluations.${index}.${field}`, label)
                        }
                    />
                </>
            ) : null,
        };
    });

    return (
        <FormSection
            id="aee-record-evaluations"
            title={title}
            variant="inline"
            iconClass="fa fa-users"
        >
            <AeeEvaluationTabs
                key={tabFocus.version}
                items={tabs}
                initialActiveId={tabFocus.id}
                emptyMessage={emptyMessage}
                errors={collectionErrors}
            />
        </FormSection>
    );
}

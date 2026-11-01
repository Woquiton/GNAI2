import FormActions from '@/components/Forms/FormActions/FormActions';
import {
    RichTextField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { severityOptions } from '../StudentDeficiencies.constants';
import { studentDeficiencyUrls } from '../StudentDeficiencies.routes';
import type {
    DeficiencyOption,
    StudentDeficiencyRecord,
    StudentDeficiencyStudent,
} from '../StudentDeficiencies.types';
import { useStudentDeficiencyForm } from './useStudentDeficiencyForm';

type StudentDeficiencyFormProps = { student: StudentDeficiencyStudent } & (
    | { mode: 'create'; deficiencies: DeficiencyOption[]; studentDeficiency?: never }
    | { mode: 'edit'; studentDeficiency: StudentDeficiencyRecord; deficiencies?: never }
);

/** Perfil (somente no vínculo), severidade e observações do perfil de atendimento do aluno. */
export default function StudentDeficiencyForm({
    student,
    mode,
    deficiencies,
    studentDeficiency,
}: StudentDeficiencyFormProps): React.JSX.Element {
    const { form, errors, formRef, save, editorFailed, reportEditorFailure } =
        useStudentDeficiencyForm(student.id, studentDeficiency);
    const editing = mode === 'edit';
    // O perfil vinculado não muda na edição: o campo aparece somente para leitura e não é enviado.
    const profileField = deficiencies ? (
        <SelectInputField
            id="student-deficiency-profile"
            name="deficiency_id"
            label="Perfil"
            required
            disabled={form.processing}
            options={deficiencies.map((deficiency) => ({
                value: String(deficiency.id),
                label: deficiency.name,
            }))}
            value={form.data.deficiency_id}
            error={errors.deficiency_id}
            onChange={(value) => form.setData('deficiency_id', value)}
        />
    ) : (
        <TextInputField
            id="student-deficiency-profile"
            label="Perfil"
            required
            readOnly
            value={studentDeficiency?.deficiency?.name ?? ''}
            error={errors.deficiency_id}
            onChange={() => undefined}
        />
    );
    const processingStatus = editing
        ? 'Salvando alterações...'
        : 'Vinculando perfil de atendimento...';

    return (
        <FormLayout
            ref={formRef}
            aria-label={
                editing ? 'Editar perfil de atendimento do aluno' : 'Vincular perfil de atendimento'
            }
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <FormSection
                        id="student-deficiency-information"
                        title={editing ? 'Atualizar Informações' : 'Identificação do Perfil'}
                        variant="inline"
                        iconClass="fa fa-universal-access"
                    >
                        <FormGrid>
                            {profileField}
                            <SelectInputField
                                id="student-deficiency-severity"
                                name="severity"
                                label="Severidade"
                                required
                                disabled={form.processing}
                                options={severityOptions}
                                value={form.data.severity}
                                error={errors.severity}
                                onChange={(value) => form.setData('severity', value)}
                            />
                            <FormGridWide>
                                <RichTextField
                                    id="student-deficiency-notes"
                                    label="Observações"
                                    defaultValue={form.data.notes}
                                    height={120}
                                    disabled={form.processing}
                                    error={errors.notes}
                                    onLoadError={() => reportEditorFailure('notes', 'observações')}
                                    onChange={(html) => form.setData('notes', html)}
                                />
                            </FormGridWide>
                        </FormGrid>
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions status={form.processing ? processingStatus : undefined}>
                <Button
                    href={studentDeficiencyUrls.record(student.id)}
                    tone="cancel"
                    label="Cancelar"
                    title="Cancelar e voltar para o prontuário do aluno"
                    aria-label="Cancelar e voltar para o prontuário do aluno"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    label="Salvar"
                    title="Salvar perfil de atendimento"
                    aria-label={
                        form.processing
                            ? 'Salvando perfil de atendimento'
                            : 'Salvar perfil de atendimento'
                    }
                    disabled={form.processing || editorFailed}
                />
            </FormActions>
        </FormLayout>
    );
}

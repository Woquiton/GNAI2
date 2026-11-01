import FormActions from '@/components/Forms/FormActions/FormActions';
import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import AccessPasswordFields from '@/components/Inclusion/People/AccessPasswordFields';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { teacherUrls } from '../Teachers.routes';
import type { TeacherRecord } from '../Teachers.types';
import TeacherPersonFields from './TeacherPersonFields';
import type { TeacherFormMode } from './TeacherForm.types';
import { useTeacherForm } from './useTeacherForm';
import './TeacherForm.css';

interface TeacherFormProps {
    mode: TeacherFormMode;
    teacher?: TeacherRecord;
}

function submissionStatus(
    photoValidating: boolean,
    processing: boolean,
    percentage: number | undefined,
): string | undefined {
    if (photoValidating) {
        return 'Preparando a foto selecionada...';
    }

    if (!processing) {
        return undefined;
    }

    return percentage !== undefined
        ? `Enviando foto: ${percentage}%`
        : 'Salvando dados do professor...';
}

function submitLabel(processing: boolean, editing: boolean): string {
    if (processing) {
        return 'Salvando professor';
    }

    return editing ? 'Atualizar professor' : 'Salvar professor';
}

/** Cadastro e edição de professores, com foto e senha inicial opcional. */
export default function TeacherForm({ mode, teacher }: TeacherFormProps): React.JSX.Element {
    const { form, errors, formRef, photoValidating, setPhotoValidating, save } = useTeacherForm(
        mode,
        teacher,
    );
    const editing = mode === 'edit';

    return (
        <FormLayout
            ref={formRef}
            aria-label={editing ? 'Editar professor' : 'Cadastrar professor'}
            aria-busy={form.processing}
            encType="multipart/form-data"
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <TeacherPersonFields
                        form={form}
                        errors={errors}
                        disabled={form.processing}
                        mode={mode}
                        person={teacher?.person}
                        onPhotoValidatingChange={setPhotoValidating}
                    />
                    <FormSection
                        id="teacher-teaching"
                        title="Dados Docentes"
                        variant="inline"
                        iconClass="fa fa-graduation-cap"
                    >
                        <FormGrid>
                            <TextInputField
                                id="teacher-registration"
                                name="registration"
                                label={editing ? 'Matrícula' : 'Número de Matrícula'}
                                required
                                maxLength={50}
                                value={form.data.registration}
                                error={errors.registration}
                                onChange={(value) => form.setData('registration', value)}
                            />
                        </FormGrid>
                    </FormSection>
                    {editing ? null : (
                        <FormSection
                            id="teacher-access"
                            title="Acesso ao Sistema"
                            variant="inline"
                            iconClass="fa fa-lock"
                        >
                            <AccessPasswordFields
                                idPrefix="teacher"
                                password={form.data.password}
                                confirmation={form.data.password_confirmation}
                                error={errors.password}
                                onChange={(field, value) => form.setData(field, value)}
                            />
                        </FormSection>
                    )}
                </fieldset>
            </CardBox>
            <FormActions
                status={submissionStatus(
                    photoValidating,
                    form.processing,
                    form.progress?.percentage,
                )}
            >
                <Button
                    href={teacher ? teacherUrls.show(teacher.id) : teacherUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    title="Cancelar e voltar"
                    aria-label="Cancelar e voltar"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    leftIconClass="fa fa-check"
                    label="Salvar"
                    title={editing ? 'Atualizar professor' : 'Salvar professor'}
                    aria-label={submitLabel(form.processing, editing)}
                    disabled={form.processing || photoValidating}
                />
            </FormActions>
        </FormLayout>
    );
}

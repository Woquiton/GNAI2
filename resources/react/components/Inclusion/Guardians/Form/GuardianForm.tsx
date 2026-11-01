import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { guardianUrls } from '../Guardians.routes';
import type { GuardianFormOptions, GuardianRecord } from '../Guardians.types';
import GuardianContactFields from './GuardianContactFields';
import GuardianPersonalFields from './GuardianPersonalFields';
import type { GuardianFormMode } from './GuardianForm.types';
import { useGuardianForm } from './useGuardianForm';

interface GuardianFormProps extends GuardianFormOptions {
    mode: GuardianFormMode;
    guardian?: GuardianRecord;
    defaultGender?: string;
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
        ? `Enviando dados: ${percentage}%`
        : 'Salvando dados do responsável...';
}

/** Cadastro e edição do responsável vinculado ao aluno, com foto. */
export default function GuardianForm({
    mode,
    student,
    genders,
    relationships,
    guardian,
    defaultGender,
}: GuardianFormProps): React.JSX.Element {
    const {
        form,
        errors,
        formRef,
        photoValidating,
        setPhotoValidating,
        selectPhoto,
        removePhoto,
        save,
    } = useGuardianForm({ mode, student, guardian, defaultGender });
    const sectionProps = { form, errors, disabled: form.processing };

    return (
        <FormLayout
            ref={formRef}
            aria-label={mode === 'edit' ? 'Editar responsável' : 'Cadastrar responsável'}
            aria-busy={form.processing}
            encType="multipart/form-data"
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <GuardianPersonalFields
                        {...sectionProps}
                        person={guardian?.person}
                        genders={genders}
                        onPhotoChange={selectPhoto}
                        onPhotoRemove={removePhoto}
                        onPhotoValidatingChange={setPhotoValidating}
                    />
                    <GuardianContactFields {...sectionProps} relationships={relationships} />
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
                    href={guardianUrls(student.id).record}
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
                    title="Salvar responsável"
                    aria-label={form.processing ? 'Salvando responsável' : 'Salvar responsável'}
                    disabled={form.processing || photoValidating}
                />
            </FormActions>
        </FormLayout>
    );
}

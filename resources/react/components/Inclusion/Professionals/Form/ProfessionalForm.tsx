import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import AccessPasswordFields from '@/components/Inclusion/People/AccessPasswordFields';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { PROFESSIONAL_TOUR_TARGETS } from '../professionalTours';
import { professionalUrls } from '../Professionals.routes';
import type { ProfessionalFormOptions, ProfessionalRecord } from '../Professionals.types';
import ProfessionalPersonFields from './ProfessionalPersonFields';
import ProfessionalWorkFields from './ProfessionalWorkFields';
import type { ProfessionalFormMode } from './ProfessionalForm.types';
import { useProfessionalForm } from './useProfessionalForm';
import './ProfessionalForm.css';

interface ProfessionalFormProps {
    mode: ProfessionalFormMode;
    options: ProfessionalFormOptions;
    professional?: ProfessionalRecord;
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
        : 'Salvando dados do profissional...';
}

/** Cadastro e edição de profissionais ou tutores de pares, com foto e senha inicial opcional. */
export default function ProfessionalForm({
    mode,
    options,
    professional,
}: ProfessionalFormProps): React.JSX.Element {
    const {
        form,
        errors,
        formRef,
        canManageAdmin,
        photoValidating,
        setPhotoValidating,
        editorFailed,
        reportEditorFailure,
        save,
    } = useProfessionalForm({ mode, options, professional });
    const editing = mode === 'edit';
    const sectionProps = { form, errors, disabled: form.processing };

    return (
        <FormLayout
            ref={formRef}
            aria-label={editing ? 'Editar profissional' : 'Cadastrar profissional'}
            aria-busy={form.processing}
            encType="multipart/form-data"
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <ProfessionalPersonFields
                        {...sectionProps}
                        mode={mode}
                        person={professional?.person}
                        genders={options.genders}
                        onPhotoValidatingChange={setPhotoValidating}
                        onEditorFailure={() => reportEditorFailure('address', 'endereço')}
                    />
                    <ProfessionalWorkFields
                        {...sectionProps}
                        mode={mode}
                        options={options}
                        canManageAdmin={canManageAdmin}
                        isAdministrator={professional?.user?.is_admin === true}
                    />
                    {editing ? null : (
                        <FormSection
                            id="professional-access"
                            title="Acesso ao Sistema"
                            variant="inline"
                            iconClass="fa fa-lock"
                            tourTarget={PROFESSIONAL_TOUR_TARGETS.access}
                        >
                            <AccessPasswordFields
                                idPrefix="professional"
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
                tourTarget={PROFESSIONAL_TOUR_TARGETS.formActions}
                status={submissionStatus(
                    photoValidating,
                    form.processing,
                    form.progress?.percentage,
                )}
            >
                <Button
                    href={
                        professional
                            ? professionalUrls.show(professional.id)
                            : professionalUrls.index
                    }
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
                    title="Salvar profissional"
                    aria-label={form.processing ? 'Salvando profissional' : 'Salvar profissional'}
                    disabled={form.processing || photoValidating || editorFailed}
                />
            </FormActions>
        </FormLayout>
    );
}

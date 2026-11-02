import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { notify } from '@/components/UI/NotificationToast/notify';
import type { PublicationRecord, PublicationFormOptions } from '../Publications.types';
import { publicationUrls } from '../Publications.routes';
import type { PublicationFormData } from './PublicationForm.types';
import {
    PublicationPeopleFields,
    PublicationScheduleFields,
    PublicationTextFields,
} from './PublicationContentFields';
import PublicationMediaFields from './PublicationMediaFields';
import PublicationPublishingFields from './PublicationPublishingFields';
import { usePublicationForm } from './usePublicationForm';
import './PublicationForm.css';
export default function PublicationForm({
    publication,
    backRoute = publicationUrls.index,
    options,
    canSubmit,
}: {
    publication?: PublicationRecord;
    backRoute?: string;
    options: PublicationFormOptions;
    canSubmit: boolean;
}): React.JSX.Element {
    const editing = Boolean(publication);
    const { form, formRef, submit, editorFailed, editorError } = usePublicationForm(
        publication,
        options,
        canSubmit,
    );
    const errors = form.errors as Record<string, string | undefined>;
    const fieldProps = {
        data: form.data,
        errors,
        disabled: form.processing,
        update: <K extends keyof PublicationFormData>(key: K, value: PublicationFormData[K]) =>
            form.setData((data) => ({ ...data, [key]: value })),
        updateWith: (callback: (data: PublicationFormData) => PublicationFormData) =>
            form.setData(callback),
    };

    function imageError(message: string): void {
        notify({ tone: 'warning', title: 'Imagem não aceita', text: message });
    }

    let submissionStatus: string | undefined;
    if (form.processing) {
        submissionStatus = form.progress
            ? `Enviando imagens... ${form.progress.percentage ?? 0}%`
            : 'Salvando...';
    }

    return (
        <FormLayout
            ref={formRef}
            onSubmit={submit}
            aria-label={editing ? 'Editar publicação' : 'Cadastrar publicação'}
            aria-busy={form.processing}
            encType="multipart/form-data"
            className="publicationForm"
        >
            <CardBox className="publicationForm__card">
                <fieldset disabled={form.processing}>
                    <PublicationTextFields
                        {...fieldProps}
                        options={options}
                        onEditorError={editorError}
                    />
                    <PublicationMediaFields
                        {...fieldProps}
                        currentCoverUrl={publication?.cover_url ?? null}
                        onImageError={imageError}
                    />
                    <PublicationScheduleFields {...fieldProps} />
                    <PublicationPeopleFields {...fieldProps} options={options} />
                    <PublicationPublishingFields
                        {...fieldProps}
                        publicBaseUrl={options.publicBaseUrl}
                    />
                </fieldset>
            </CardBox>
            <FormActions status={submissionStatus}>
                <Button
                    href={backRoute}
                    tone="cancel"
                    label="Cancelar"
                    title="Cancelar e voltar para as publicações"
                    aria-label="Cancelar e voltar para as publicações"
                    disabled={form.processing}
                />
                {canSubmit ? (
                    <Button
                        type="submit"
                        tone="save"
                        label={form.processing ? 'Salvando...' : 'Salvar'}
                        title={editing ? 'Salvar alterações da publicação' : 'Cadastrar publicação'}
                        aria-label={
                            editing ? 'Salvar alterações da publicação' : 'Cadastrar publicação'
                        }
                        disabled={form.processing || editorFailed}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}

import FileUploadButton from '@/components/Forms/FileUploadButton/FileUploadButton';
import FieldError from '@/components/Forms/FormField/FieldError';
import { fieldErrorId } from '@/components/Forms/FormField/fieldDescription';
import { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import RemovableField from '@/components/Forms/RemovableField/RemovableField';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Button from '@/components/UI/Button/Button';
import { notify } from '@/components/UI/NotificationToast/notify';
import type { SupportRequestAttachment } from '../SupportRequests.types';
import { SUPPORT_REQUEST_TOUR_TARGETS } from '../supportRequestTours';
import type { SupportRequestFieldsProps } from './SupportRequestForm.types';

export default function SupportRequestAttachmentsFields({
    data,
    errors,
    disabled,
    update,
    existing,
}: SupportRequestFieldsProps & { existing: SupportRequestAttachment[] }): React.JSX.Element {
    const error =
        errors.attachments ??
        errors.remove_attachment_ids ??
        Object.entries(errors).find(
            ([key]) => key.startsWith('attachments.') || key.startsWith('remove_attachment_ids.'),
        )?.[1];
    const kept = existing.filter((file) => !data.remove_attachment_ids.includes(file.id)).length;

    function addFiles(files: FileList | null): void {
        if (!files) return;
        const selected = Array.from(files);
        let message = '';
        if (kept + data.attachments.length + selected.length > 10) {
            message = 'Uma solicitação pode ter no máximo 10 anexos.';
        } else if (selected.some((file) => file.size > 10 * 1024 * 1024)) {
            message = 'Cada anexo pode ter no máximo 10 MB.';
        } else if (
            selected.some((file) => !/\.(pdf|doc|docx|odt|jpg|jpeg|png)$/i.test(file.name))
        ) {
            message = 'Use PDF, DOC, DOCX, ODT, JPG ou PNG.';
        }
        const fingerprints = [...data.attachments, ...selected].map(
            (file) => `${file.name}-${file.size}-${file.lastModified}`,
        );
        if (new Set(fingerprints).size !== fingerprints.length) {
            message = 'Este arquivo já foi selecionado. Remova a cópia repetida.';
        }
        if (message) {
            notify({ tone: 'warning', title: 'Anexos não adicionados', text: message });
            return;
        }
        update('attachments', [...data.attachments, ...selected]);
    }

    return (
        <FormSection
            id="support-request-attachments"
            tourTarget={SUPPORT_REQUEST_TOUR_TARGETS.attachments}
            title="Documentos"
            variant="inline"
            iconClass="fa fa-paperclip"
            titleAddon={
                <InfoTooltip
                    label="Mais informações sobre os documentos"
                    text="Anexos opcionais. Até 10 arquivos, com 10 MB por arquivo, em PDF, DOC, DOCX, ODT, JPG ou PNG. Não é necessário anexar laudo para registrar a solicitação."
                />
            }
        >
            <FormStack>
                {existing.map((file) => {
                    const removed = data.remove_attachment_ids.includes(file.id);
                    return (
                        <RemovableField
                            key={file.id}
                            removed={removed}
                            disabled={disabled}
                            removeLabel={`Remover ${file.name}`}
                            restoreLabel={`Manter ${file.name}`}
                            onRemove={() =>
                                update(
                                    'remove_attachment_ids',
                                    removed
                                        ? data.remove_attachment_ids.filter((id) => id !== file.id)
                                        : [...data.remove_attachment_ids, file.id],
                                )
                            }
                        >
                            <Button
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                tone="white"
                                leftIconClass="fa fa-download"
                                label={file.name}
                                title={`Baixar ${file.name}${removed ? ' (será removido ao salvar)' : ''}`}
                            />
                            {removed ? <span>Será removido ao salvar.</span> : null}
                        </RemovableField>
                    );
                })}
                {data.attachments.map((file, index) => (
                    <RemovableField
                        key={`${file.name}-${file.size}-${file.lastModified}`}
                        removeLabel={`Remover ${file.name}`}
                        disabled={disabled}
                        onRemove={() =>
                            update(
                                'attachments',
                                data.attachments.filter((_, position) => position !== index),
                            )
                        }
                    >
                        <TextInput
                            value={file.name}
                            readOnly
                            aria-label={`Novo anexo ${index + 1}`}
                        />
                    </RemovableField>
                ))}
                <FileUploadButton
                    id="support-request-files"
                    name="attachments[]"
                    label="Adicionar documentos"
                    multiple
                    accept=".pdf,.doc,.docx,.odt,.jpg,.jpeg,.png"
                    disabled={disabled || kept + data.attachments.length >= 10}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? fieldErrorId('support-request-files') : undefined}
                    onChange={(event) => {
                        addFiles(event.target.files);
                        event.target.value = '';
                    }}
                />
                <FieldError id="support-request-files" error={error} />
            </FormStack>
        </FormSection>
    );
}

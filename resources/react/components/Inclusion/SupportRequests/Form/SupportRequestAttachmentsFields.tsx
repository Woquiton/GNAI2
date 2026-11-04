import FileDropzone from '@/components/Forms/FileDropzone/FileDropzone';
import FieldError from '@/components/Forms/FormField/FieldError';
import { fieldErrorId } from '@/components/Forms/FormField/fieldDescription';
import { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import RemovableField from '@/components/Forms/RemovableField/RemovableField';
import Button from '@/components/UI/Button/Button';
import { notify } from '@/components/UI/NotificationToast/notify';
import type { SupportRequestAttachment } from '../SupportRequests.types';
import { SUPPORT_REQUEST_TOUR_TARGETS } from '../supportRequestTours';
import type { SupportRequestFieldsProps } from './SupportRequestForm.types';

const MAX_ATTACHMENTS = 10;
const ACCEPTED_FILES = '.pdf,.doc,.docx,.odt,.jpg,.jpeg,.png';

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

    function warn(text: string): void {
        notify({ tone: 'warning', title: 'Anexos não adicionados', text });
    }

    /** O Dropzone barra tipo e tamanho; aqui ficam as cópias e o total com os anexos salvos. */
    function changeFiles(files: File[]): void {
        const seen = new Set<string>();
        const unique = files.filter((file) => {
            const fingerprint = `${file.name}-${file.size}-${file.lastModified}`;
            if (seen.has(fingerprint)) return false;
            seen.add(fingerprint);
            return true;
        });
        if (kept + unique.length > MAX_ATTACHMENTS) {
            warn(`Uma solicitação pode ter no máximo ${MAX_ATTACHMENTS} anexos.`);
            // Lista nova mesmo sem mudanças, para a área de envio descartar o que foi recusado.
            update('attachments', [...data.attachments]);
            return;
        }
        if (unique.length !== files.length) {
            warn('Este arquivo já foi selecionado. Remova a cópia repetida.');
        }
        update('attachments', unique);
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
                <FileDropzone
                    acceptedFiles={ACCEPTED_FILES}
                    maxFiles={MAX_ATTACHMENTS}
                    maxFilesMessage={`Uma solicitação pode ter no máximo ${MAX_ATTACHMENTS} anexos.`}
                    maxFileSizeMb={10}
                    onFilesChange={changeFiles}
                    onError={(_file, message) => warn(message)}
                    selection={{
                        id: 'support-request-files',
                        name: 'attachments[]',
                        disabled,
                        invalid: Boolean(error),
                        describedBy: error ? fieldErrorId('support-request-files') : undefined,
                        files: data.attachments,
                    }}
                />
                <FieldError id="support-request-files" error={error} />
            </FormStack>
        </FormSection>
    );
}

import { useEffect, useState } from 'react';
import FileUploadButton from '@/components/Forms/FileUploadButton/FileUploadButton';
import FileDropzone from '@/components/Forms/FileDropzone/FileDropzone';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import FormField from '@/components/Forms/FormField/FormField';
import Button from '@/components/UI/Button/Button';
import '@styles/components/Forms/EvidenceUpload/EvidenceUpload.css';

const defaultAccept =
    '.jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.ppt,.pptx,.odp,.odt,.ods,.xls,.xlsx,.csv,.txt';

function EvidenceFile({
    file,
    onRemove,
    disabled,
}: {
    file: File;
    onRemove: () => void;
    disabled: boolean;
}): React.JSX.Element {
    const [previewUrl, setPreviewUrl] = useState('');
    useEffect(() => {
        if (!file.type.startsWith('image/')) {
            return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);
    return (
        <li>
            {previewUrl ? (
                <img src={previewUrl} alt="" />
            ) : (
                <i className="fa fa-file-o evidenceUpload__fileIcon" aria-hidden="true" />
            )}
            <span>{file.name}</span>
            <Button
                disabled={disabled}
                tone="danger"
                size="xs"
                rounded
                iconOnly
                leftIconClass="fa fa-times"
                aria-label={`Remover ${file.name}`}
                title={`Remover ${file.name}`}
                className="evidenceUpload__remove"
                onClick={onRemove}
            />
        </li>
    );
}

export default function EvidenceUpload({
    id,
    name,
    files,
    onChange,
    error,
    disabled = false,
    maxFiles = 10,
    maxFileSizeMb = 20,
    accept = defaultAccept,
    label = 'Evidências',
    maxFilesMessage,
    variant = 'button',
}: {
    id: string;
    name: string;
    files: File[];
    onChange: (files: File[]) => void;
    error?: string;
    disabled?: boolean;
    maxFiles?: number;
    maxFileSizeMb?: number;
    accept?: string;
    label?: string;
    maxFilesMessage?: string;
    variant?: 'button' | 'dropzone';
}): React.JSX.Element {
    const [localError, setLocalError] = useState('');
    const message = error ?? localError;
    function add(selected: FileList | File[] | null): void {
        if (!selected || disabled) {
            return;
        }
        const next = [...files, ...Array.from(selected)];
        if (next.length > maxFiles) {
            setLocalError(
                maxFilesMessage ?? `Uma inspeção pode possuir no máximo ${maxFiles} evidências.`,
            );
            return;
        }
        const oversized = next.find((file) => file.size > maxFileSizeMb * 1024 * 1024);
        if (oversized) {
            setLocalError(
                `O arquivo ${oversized.name} ultrapassa o limite de ${maxFileSizeMb} MB.`,
            );
            return;
        }
        setLocalError('');
        onChange(next);
    }
    return (
        <FormField
            id={id}
            label={label}
            error={message}
            hint={`Até ${maxFiles} arquivos. Imagens, PDF, documentos, planilhas, textos e apresentações; máximo de ${maxFileSizeMb} MB por arquivo.`}
            hintLabel={`Informações sobre ${label.toLowerCase()}`}
        >
            {variant === 'dropzone' ? (
                <FileDropzone
                    acceptedFiles={accept}
                    maxFiles={maxFiles}
                    maxFilesMessage={maxFilesMessage}
                    maxFileSizeMb={maxFileSizeMb}
                    onFilesChange={(selected) => {
                        setLocalError('');
                        onChange(selected);
                    }}
                    onError={(_file, message) => setLocalError(message)}
                    onLoadError={() =>
                        setLocalError(
                            'Não foi possível carregar o seletor de arquivos. Atualize a página e tente novamente.',
                        )
                    }
                    selection={{
                        id,
                        name,
                        disabled,
                        invalid: Boolean(message),
                        describedBy: fieldDescribedBy(id, { error: message }),
                        files,
                    }}
                />
            ) : (
                <FileUploadButton
                    id={id}
                    name={name}
                    label="Escolher arquivos"
                    accept={accept}
                    multiple
                    disabled={disabled}
                    onChange={(event) => {
                        add(event.target.files);
                        event.target.value = '';
                    }}
                />
            )}
            {variant === 'button' && files.length ? (
                <ul className="evidenceUpload__files" aria-live="polite">
                    {files.map((file, index) => (
                        <EvidenceFile
                            key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                            file={file}
                            disabled={disabled}
                            onRemove={() => {
                                setLocalError('');
                                onChange(files.filter((_, itemIndex) => itemIndex !== index));
                            }}
                        />
                    ))}
                </ul>
            ) : null}
        </FormField>
    );
}

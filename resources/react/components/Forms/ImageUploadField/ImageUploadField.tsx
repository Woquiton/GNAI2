import { useEffect, useState } from 'react';
import FileDropzone from '@/components/Forms/FileDropzone/FileDropzone';
import Button from '@/components/UI/Button/Button';
import { joinClassNames } from '@/utils/joinClassNames';
import './ImageUploadField.css';

export const defaultImageAccept = '.jpg,.jpeg,.png,.webp';

/** Gera uma URL temporária para a prévia do arquivo e a libera ao trocar ou desmontar. */
export function useObjectUrl(file: File | null | undefined): string | null {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return url;
}

/**
 * Seleção de uma imagem com prévia e remoção. O formulário pai controla o
 * arquivo novo, a imagem atual e a marcação de remoção; nada é enviado
 * automaticamente. Use PersonPhotoUpload para fotos de pessoas.
 */
export default function ImageUploadField({
    id,
    name,
    label,
    file,
    currentUrl,
    removed = false,
    previewAlt = '',
    accept = defaultImageAccept,
    maxSizeBytes = 4 * 1024 * 1024,
    disabled = false,
    invalid = false,
    describedBy,
    variant = 'landscape',
    onChange,
    onRemove,
    onError,
}: {
    id: string;
    name: string;
    label: string;
    file: File | null;
    currentUrl?: string | null;
    removed?: boolean;
    previewAlt?: string;
    accept?: string;
    maxSizeBytes?: number;
    disabled?: boolean;
    invalid?: boolean;
    describedBy?: string;
    variant?: 'landscape' | 'logo';
    onChange: (file: File) => void;
    onRemove: () => void;
    onError?: (message: string) => void;
}): React.JSX.Element {
    const fileUrl = useObjectUrl(file);
    const previewUrl = fileUrl ?? (removed ? null : (currentUrl ?? null));
    const allowed = accept.split(',').map((extension) => extension.trim().toLowerCase());

    function select(selected: File | undefined): void {
        if (!selected) return;

        const extension = `.${selected.name.split('.').pop()?.toLowerCase() ?? ''}`;

        if (!allowed.includes(extension)) {
            onError?.(
                `Selecione uma imagem nos formatos ${allowed.join(', ').replaceAll('.', '').toUpperCase()}.`,
            );
            return;
        }

        if (selected.size > maxSizeBytes) {
            onError?.(`A imagem deve ter no máximo ${Math.round(maxSizeBytes / 1024 / 1024)} MB.`);
            return;
        }

        onChange(selected);
    }

    return (
        <div
            className={joinClassNames(
                'imageUploadField',
                `imageUploadField--${variant}`,
                invalid && 'imageUploadField--invalid',
            )}
        >
            <div
                className={joinClassNames(
                    'imageUploadField__drop',
                    Boolean(previewUrl) && 'imageUploadField__drop--filled',
                )}
            >
                <FileDropzone
                    compact
                    message="Arraste a imagem aqui ou clique para selecionar"
                    picker={{
                        id,
                        name,
                        accept,
                        disabled,
                        invalid,
                        describedBy,
                        onPick: (files) => select(files[0]),
                    }}
                    maxFilesMessage="Selecione apenas uma imagem."
                    onError={(_file, message) => onError?.(message)}
                    onLoadError={() =>
                        onError?.(
                            'Não foi possível carregar o seletor de imagens. Atualize a página e tente novamente.',
                        )
                    }
                />
                {previewUrl ? (
                    <>
                        <img
                            className="imageUploadField__image"
                            src={previewUrl}
                            alt={previewAlt}
                        />
                        <span className="imageUploadField__change" aria-hidden="true">
                            Arraste ou clique para trocar
                        </span>
                    </>
                ) : null}
            </div>
            {previewUrl ? (
                <div className="imageUploadField__actions">
                    <Button
                        tone="dark-red"
                        size="sm"
                        leftIconClass="fa fa-trash-o"
                        label="Remover"
                        title={`Remover ${label.toLowerCase()}`}
                        aria-label={`Remover ${label.toLowerCase()}`}
                        disabled={disabled}
                        onClick={onRemove}
                    />
                </div>
            ) : null}
        </div>
    );
}

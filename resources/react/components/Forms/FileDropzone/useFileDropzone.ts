import { useEffect, useRef, type RefObject, type MutableRefObject } from 'react';
import { loadExternalScript } from '@/utils/loadExternalScript';
import { notifyOperationFailure } from '@/components/UI/NotificationToast/operationFeedback';
import type {
    DropzoneConstructor,
    DropzoneFile,
    DropzoneInstance,
    FileDropzoneProps,
} from './FileDropzone.types';

/** Mantém o template e o SVG originais, tornando o X uma ação acessível de remoção. */
function selectionPreview(template: string): string {
    const container = document.createElement('div');
    container.innerHTML = template;
    const mark = container.querySelector('.dz-error-mark');
    if (mark) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'dz-remove fileDropzone__remove';
        button.setAttribute('data-dz-remove', '');
        button.append(...Array.from(mark.childNodes));
        const svg = button.querySelector('svg');
        svg?.setAttribute('aria-hidden', 'true');
        // O <title>Error</title> do SVG original sobreporia o title "Remover <arquivo>" do botão.
        svg?.querySelector('title')?.remove();
        mark.replaceWith(button);
    }
    return container.innerHTML;
}

type DropzoneControl = NonNullable<FileDropzoneProps['selection'] | FileDropzoneProps['picker']>;

/** Seleção controlada ou modo de escolha: os dois expõem o mesmo campo acessível. */
export function dropzoneControl(props: FileDropzoneProps): DropzoneControl | undefined {
    return props.selection ?? props.picker;
}

function updateAccessibility(
    dropzone: DropzoneInstance,
    element: HTMLElement,
    selection: DropzoneControl | undefined,
): void {
    if (!selection) return;
    element.id = `${selection.id}-dropzone`;
    element.tabIndex = selection.disabled ? -1 : 0;
    element.setAttribute('aria-invalid', String(Boolean(selection.invalid)));
    if (selection.describedBy) element.setAttribute('aria-describedby', selection.describedBy);
    else element.removeAttribute('aria-describedby');
    const input = dropzone.hiddenFileInput;
    input.id = selection.id;
    input.name = selection.name;
    input.disabled = Boolean(selection.disabled);
    if ('onPick' in selection) {
        if (selection.accept) input.accept = selection.accept;
        else input.removeAttribute('accept');
    }
    for (const file of dropzone.files) {
        const button = file.previewElement?.querySelector<HTMLButtonElement>('[data-dz-remove]');
        if (!button) continue;
        button.disabled = Boolean(selection.disabled);
        button.title = `Remover ${file.name}`;
        button.setAttribute('aria-label', `Remover ${file.name}`);
    }
}

export function useFileDropzone(
    host: RefObject<HTMLDivElement | null>,
    props: FileDropzoneProps,
): MutableRefObject<DropzoneInstance | undefined> {
    const instance = useRef<DropzoneInstance | undefined>(undefined);
    const callbacks = useRef(props);
    callbacks.current = props;
    const syncing = useRef(false);
    const { uploadUrl, maxFileSizeMb = 256, acceptedFiles, maxFilesMessage, message } = props;
    const pickerMode = Boolean(props.picker);
    // No modo de escolha, um arquivo por vez quando não é múltiplo; a área se esvazia a cada escolha.
    const maxFiles = pickerMode ? (props.picker?.multiple ? undefined : 1) : props.maxFiles;
    const selectionMode = Boolean(props.selection) || pickerMode;

    useEffect(() => {
        let cancelled = false;
        let element: HTMLDivElement | undefined;
        async function initialize(): Promise<void> {
            await loadExternalScript('/assets/react/plugins/dropzone/dropzone.js');
            if (cancelled || !host.current) return;
            const Dropzone = (window as Window & { Dropzone?: DropzoneConstructor }).Dropzone;
            if (!Dropzone) throw new Error('Dropzone indisponível.');
            element = document.createElement('div');
            element.className = selectionMode ? 'dropzone fileDropzone__selection' : 'dropzone';
            element.tabIndex = 0;
            element.setAttribute('role', 'group');
            element.setAttribute(
                'aria-label',
                message ?? 'Selecionar ou arrastar arquivos para envio',
            );
            host.current.append(element);
            const dropzone = new Dropzone(element, {
                url: uploadUrl ?? '#',
                maxFilesize: maxFileSizeMb,
                maxFiles,
                acceptedFiles,
                autoProcessQueue: Boolean(uploadUrl) && !selectionMode,
                autoQueue: !selectionMode,
                dictDefaultMessage: message ?? 'Solte arquivos para enviar',
                dictFallbackMessage: 'Seu navegador não suporta arrastar arquivos.',
                dictFallbackText: 'Selecione os arquivos para enviar.',
                dictFileTooBig:
                    'Arquivo muito grande ({{filesize}} MiB). Máximo: {{maxFilesize}} MiB.',
                dictInvalidFileType: 'Este tipo de arquivo não é permitido.',
                dictResponseError: 'O servidor respondeu com o código {{statusCode}}.',
                dictCancelUpload: 'Cancelar envio',
                dictCancelUploadConfirmation: 'Cancelar o envio deste arquivo?',
                dictRemoveFile: 'Remover arquivo',
                dictMaxFilesExceeded:
                    maxFilesMessage ??
                    `Uma inspeção pode possuir no máximo ${maxFiles} evidências.`,
                ...(selectionMode
                    ? {
                          previewTemplate: selectionPreview(
                              Dropzone.prototype.defaultOptions.previewTemplate,
                          ),
                      }
                    : {}),
                ...(!uploadUrl && !selectionMode
                    ? {
                          accept: (_file: File, done: (error?: string) => void): void =>
                              done('Nenhum destino de envio foi configurado.'),
                      }
                    : {}),
            });
            instance.current = dropzone;
            element.addEventListener('keydown', (event: KeyboardEvent) => {
                if (event.target === element && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    if (!dropzoneControl(callbacks.current)?.disabled) {
                        dropzone.hiddenFileInput.click();
                    }
                }
            });
            function pick(): void {
                // Arquivos soltos juntos chegam em vários addedfile; o primeiro microtask leva todos.
                queueMicrotask(() => {
                    if (cancelled || !dropzone.files.length) return;
                    const files = dropzone.files.filter((file) => file.accepted);
                    syncing.current = true;
                    for (const file of [...dropzone.files]) dropzone.removeFile(file);
                    syncing.current = false;
                    if (files.length) callbacks.current.picker?.onPick(files);
                });
            }
            function publish(): void {
                if (syncing.current || cancelled) return;
                if (pickerMode) {
                    pick();
                    return;
                }
                // O Dropzone valida o arquivo depois de emitir addedfile.
                queueMicrotask(() => {
                    if (cancelled) return;
                    const files = selectionMode
                        ? dropzone.files.filter((file) => file.accepted)
                        : [...dropzone.files];
                    callbacks.current.onFilesChange?.(files);
                });
            }
            dropzone.on('addedfile', (value) => {
                const file = value as DropzoneFile;
                if (selectionMode) file.previewElement?.classList.add('dz-complete');
                if (element) {
                    updateAccessibility(dropzone, element, dropzoneControl(callbacks.current));
                }
                publish();
            });
            dropzone.on('removedfile', () => {
                if (!pickerMode) publish();
            });
            dropzone.on('success', (file, response) =>
                callbacks.current.onSuccess?.(file as File, response),
            );
            dropzone.on('error', (file, message) => {
                const text =
                    message && typeof message === 'object' && 'error' in message
                        ? String(message.error)
                        : String(message);
                if (selectionMode) dropzone.removeFile(file as File);
                if (selectionMode) {
                    queueMicrotask(() => {
                        if (!cancelled) callbacks.current.onError?.(file as File, text);
                    });
                } else callbacks.current.onError?.(file as File, text);
            });
            syncing.current = true;
            for (const file of callbacks.current.selection?.files ?? []) dropzone.addFile(file);
            syncing.current = false;
            updateAccessibility(dropzone, element, dropzoneControl(callbacks.current));
        }
        void initialize().catch(() => {
            if (cancelled) return;
            callbacks.current.onLoadError?.();
            notifyOperationFailure(
                'Não foi possível carregar o upload de arquivos. Atualize a página e tente novamente.',
            );
        });
        return () => {
            cancelled = true;
            syncing.current = true;
            instance.current?.destroy();
            instance.current = undefined;
            syncing.current = false;
            element?.remove();
        };
    }, [
        host,
        uploadUrl,
        maxFileSizeMb,
        acceptedFiles,
        maxFiles,
        maxFilesMessage,
        message,
        selectionMode,
        pickerMode,
    ]);

    useEffect(() => {
        const dropzone = instance.current;
        const element = host.current?.querySelector<HTMLElement>('.dropzone');
        const selection = props.selection;
        if (dropzone && element && props.picker) {
            updateAccessibility(dropzone, element, props.picker);
            return;
        }
        if (!dropzone || !element || !selection) return;
        syncing.current = true;
        for (const file of [...dropzone.files]) {
            if (!selection.files.includes(file)) dropzone.removeFile(file);
        }
        for (const file of selection.files) {
            if (!dropzone.files.includes(file)) dropzone.addFile(file);
        }
        syncing.current = false;
        updateAccessibility(dropzone, element, callbacks.current.selection);
    });
    return instance;
}

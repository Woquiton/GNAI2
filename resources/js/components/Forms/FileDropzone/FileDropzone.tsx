import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { FileDropzoneHandle, FileDropzoneProps } from './FileDropzone.types';
import { dropzoneControl, useFileDropzone } from './useFileDropzone';
import { joinClassNames } from '@/utils/joinClassNames';
import '@styles/components/Forms/FileDropzone/FileDropzone.plugin.css';
import '@styles/components/Forms/FileDropzone/FileDropzone.css';

const FileDropzone = forwardRef<FileDropzoneHandle, FileDropzoneProps>(
    function FileDropzone(props, forwardedRef) {
        const host = useRef<HTMLDivElement>(null);
        const instance = useFileDropzone(host, props);
        const disabled = dropzoneControl(props)?.disabled;
        const composed = props.children !== undefined;
        useImperativeHandle(
            forwardedRef,
            () => ({
                submit: (): void => {
                    if (!props.selection) instance.current?.processQueue();
                },
            }),
            [instance, props.selection],
        );

        /** Só a área de soltar fica bloqueada; a lista composta continua editável. */
        function insideDropArea(target: EventTarget): boolean {
            const area = host.current?.querySelector('.dropzone');
            return !composed || Boolean(area && target instanceof Node && area.contains(target));
        }

        return (
            <div
                ref={host}
                className={joinClassNames(
                    'fileDropzone',
                    props.compact && 'fileDropzone--compact',
                    composed && 'fileDropzone--composed',
                )}
                aria-disabled={disabled || undefined}
                onClickCapture={(event) => {
                    if (disabled && insideDropArea(event.target)) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }}
                onDropCapture={(event) => {
                    if (disabled) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }}
                onDragOver={(event) => {
                    // Arquivos soltos sobre a lista composta também entram, como na área de soltar.
                    if (composed && !disabled) event.preventDefault();
                }}
                onDrop={(event) => {
                    if (!composed || disabled || !instance.current) return;
                    event.preventDefault();
                    for (const file of Array.from(event.dataTransfer.files)) {
                        instance.current.addFile(file);
                    }
                }}
            >
                {/* Sempre presente: a área do Dropzone é anexada depois deste nó pelo hook. */}
                <div className="fileDropzone__content">{props.children}</div>
            </div>
        );
    },
);
export default FileDropzone;

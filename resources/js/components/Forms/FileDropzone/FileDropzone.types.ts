import type { ReactNode } from 'react';

export interface FileDropzoneProps {
    /** Endpoint accepting multipart/form-data with the field `file`. */
    uploadUrl?: string;
    /** Seleção controlada pelo formulário, sem requisição separada de upload. */
    selection?: {
        id: string;
        name: string;
        disabled?: boolean;
        invalid?: boolean;
        describedBy?: string;
        files: File[];
    };
    /**
     * Área só para escolher arquivos: entrega os aceitos em `onPick` e se esvazia em seguida.
     * Use quando o formulário já mostra a própria lista ou prévia (galerias, imagem única).
     */
    picker?: {
        id: string;
        name: string;
        disabled?: boolean;
        invalid?: boolean;
        describedBy?: string;
        /** Extensões do seletor de arquivos; a validação fica com quem recebe `onPick`. */
        accept?: string;
        multiple?: boolean;
        onPick: (files: File[]) => void;
    };
    /**
     * Conteúdo do formulário dentro da moldura tracejada, acima do convite para soltar
     * (por exemplo, a lista de fotos com texto alternativo). Arquivos soltos sobre ele também entram.
     */
    children?: ReactNode;
    /** Texto da área vazia, também usado como nome acessível. */
    message?: string;
    /** Área mais baixa, para ficar ao lado de uma prévia ou abaixo de uma lista. */
    compact?: boolean;
    maxFiles?: number;
    /** Aviso quando o limite de arquivos é ultrapassado; o padrão fala em evidências de inspeção. */
    maxFilesMessage?: string;
    maxFileSizeMb?: number;
    acceptedFiles?: string;
    onFilesChange?: (files: File[]) => void;
    onSuccess?: (file: File, response: unknown) => void;
    onError?: (file: File, message: string) => void;
    onLoadError?: () => void;
}
export interface FileDropzoneHandle {
    submit: () => void;
}
export interface DropzoneFile extends File {
    accepted?: boolean;
    previewElement?: HTMLElement;
}
export interface DropzoneInstance {
    files: DropzoneFile[];
    hiddenFileInput: HTMLInputElement;
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    addFile: (file: File) => void;
    removeFile: (file: File) => void;
    processQueue: () => void;
    destroy: () => void;
}
export interface DropzoneConstructor {
    new (element: HTMLElement, options: Record<string, unknown>): DropzoneInstance;
    prototype: { defaultOptions: { previewTemplate: string } };
}

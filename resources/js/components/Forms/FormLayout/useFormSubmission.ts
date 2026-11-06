import { type InertiaFormProps } from '@inertiajs/react';
import type { UseFormSubmitOptions } from '@inertiajs/core';
import { useRef } from 'react';
import {
    notifyConnectionFailure,
    notifyOperationFailure,
} from '@/components/UI/NotificationToast/operationFeedback';
import { toJsonPayload } from './jsonPayload';

type SubmitMethod = 'post' | 'put' | 'patch' | 'delete';

export interface FormSubmitRequest {
    url: string;
    method?: SubmitMethod;
    /**
     * Envia multipart/form-data. Em PUT/PATCH, usa POST com `_method`, como o Laravel exige para
     * receber arquivos.
     */
    files?: boolean;
    /**
     * Com `files`, envia os campos num único JSON e só os arquivos como multipart. Use em
     * formulários com centenas de campos, que ultrapassariam o `max_input_vars` do PHP.
     */
    jsonPayload?: boolean;
    /** Mensagem do toast quando o servidor responde com erro não relacionado à validação. */
    failureText: string;
    /** Impede o envio (sem permissão, editor indisponível, leitura de arquivo em andamento...). */
    blocked?: boolean;
    /**
     * Ajusta o payload antes do envio (por exemplo, a edição que envia só alguns campos).
     * O `_method` dos envios com arquivos é acrescentado depois desta transformação.
     */
    transform?: (data: Record<string, unknown>) => Record<string, unknown>;
    options?: Omit<
        UseFormSubmitOptions,
        'onHttpException' | 'onNetworkError' | 'onFinish' | 'forceFormData'
    > & {
        onFinish?: () => void;
    };
}

/** Coloca o foco no primeiro controle marcado como inválido dentro do formulário. */
export function focusFirstInvalid(form: HTMLFormElement | null): void {
    requestAnimationFrame(() => {
        const invalid = form?.querySelector<HTMLElement>('[aria-invalid="true"]');
        if (!invalid) return;

        // ChoiceGroup marca o grupo como inválido; o foco deve chegar a um controle interno.
        const controlSelector =
            'input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), [tabindex], [contenteditable="true"]';
        const target = invalid.matches(controlSelector)
            ? invalid
            : invalid.querySelector<HTMLElement>(controlSelector);
        target?.focus();
    });
}

/**
 * Envio padronizado dos formulários Inertia do Gnai:
 *
 * - impede envios duplicados enquanto a requisição anterior não termina;
 * - mantém a rolagem e focaliza o primeiro campo inválido após erros de validação;
 * - apresenta falhas do servidor e de conexão no toast compartilhado;
 * - o sucesso continua vindo do redirect com `flash` do controller.
 *
 * Ligue `formRef` ao `FormLayout` para o foco automático funcionar.
 */
// `Record<string, any>` é a mesma restrição do `useForm` do Inertia e aceita interfaces.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFormSubmission<TForm extends Record<string, any>>(
    form: InertiaFormProps<TForm>,
) {
    const formRef = useRef<HTMLFormElement>(null);
    const pending = useRef(false);

    function submit({
        url,
        method = 'post',
        files = false,
        jsonPayload = false,
        failureText,
        blocked = false,
        transform,
        options = {},
    }: FormSubmitRequest): void {
        if (blocked || pending.current || form.processing) {
            return;
        }

        const spoofMethod = files && method !== 'post';
        const { onError, onFinish, ...visitOptions } = options;

        pending.current = true;
        form.transform((data) => {
            const transformed = transform ? transform(data as Record<string, unknown>) : data;
            const payload =
                files && jsonPayload
                    ? toJsonPayload(transformed as Record<string, unknown>)
                    : transformed;

            return spoofMethod ? { ...payload, _method: method } : payload;
        });
        form.submit(spoofMethod ? 'post' : method, url, {
            preserveScroll: true,
            ...visitOptions,
            forceFormData: files || undefined,
            onError: (errors) => {
                focusFirstInvalid(formRef.current);
                onError?.(errors);
            },
            onHttpException: () => {
                notifyOperationFailure(failureText);
                return false;
            },
            onNetworkError: () => {
                notifyConnectionFailure();
                return false;
            },
            onFinish: () => {
                pending.current = false;
                onFinish?.();
            },
        });
    }

    return { formRef, submit };
}

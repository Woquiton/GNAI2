import type { ErrorCode } from '@/components/UI/ErrorState/ErrorState.types';

const supportedStatuses: ErrorCode[] = ['400', '403', '404', '419', '429', '500', '503'];

/** Código com conteúdo próprio no `ErrorState`; os demais status usam a página de erro 500. */
export function errorCodeFromStatus(status: number): ErrorCode {
    const code = String(status) as ErrorCode;

    return supportedStatuses.includes(code) ? code : '500';
}

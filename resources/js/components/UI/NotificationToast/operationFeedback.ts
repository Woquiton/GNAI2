import { notify } from './notify';

/** Textos padronizados das falhas de operações; o sucesso continua vindo do `flash` do backend. */
export const CONNECTION_FAILURE_TEXT =
    'Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.';

export function notifyOperationFailure(text: string): void {
    notify({ tone: 'error', title: 'Não foi possível concluir', text });
}

export function notifyConnectionFailure(): void {
    notify({ tone: 'error', title: 'Falha de conexão', text: CONNECTION_FAILURE_TEXT });
}

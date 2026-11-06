import type { ReactNode } from 'react';

/**
 * Contrato comum dos campos compostos: label, obrigatoriedade, dica e erro ficam no `FormField`;
 * o controle recebe o estado inválido e a descrição acessível correspondentes.
 */
export interface FieldBaseProps {
    id: string;
    label: string;
    /** Mensagem do Laravel/Inertia para o campo. */
    error?: string;
    /** Exibe o indicador de obrigatório e marca o controle como `required`. */
    required?: boolean;
    hint?: string;
    /** Quando informado, a dica aparece em tooltip ao lado do label. */
    hintLabel?: string;
    /** Classe do contêiner `FormField`. */
    fieldClassName?: string;
    /** Conteúdo exibido logo abaixo do controle, antes da mensagem de erro. */
    children?: ReactNode;
}

export interface FieldOption<T extends string | number = string> {
    value: T;
    label: string;
}

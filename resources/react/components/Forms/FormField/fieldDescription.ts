/** IDs gerados por `FormField` para a mensagem de erro e a dica exibida abaixo do controle. */
export function fieldErrorId(id: string): string {
    return `${id}-error`;
}

export function fieldHintId(id: string): string {
    return `${id}-hint`;
}

/**
 * Valor de `aria-describedby` para um controle dentro de `FormField`: inclui a dica visível e o
 * erro atual, preservando descrições externas informadas pelo consumidor.
 */
export function fieldDescribedBy(
    id: string,
    {
        error,
        hint,
        describedBy,
    }: {
        error?: string;
        /** Somente dicas exibidas abaixo do controle; dicas em tooltip têm descrição própria. */
        hint?: boolean;
        describedBy?: string;
    } = {},
): string | undefined {
    const ids = [
        describedBy,
        hint ? fieldHintId(id) : undefined,
        error ? fieldErrorId(id) : undefined,
    ]
        .filter(Boolean)
        .join(' ');

    return ids || undefined;
}

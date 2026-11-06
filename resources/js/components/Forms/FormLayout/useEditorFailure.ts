import { type InertiaFormProps } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Falha de carregamento de editores ricos (`RichTextField`): mostra o erro no campo e devolve
 * `editorFailed` para bloquear o envio, evitando salvar um conteúdo que não pôde ser editado.
 * `field` aceita chaves aninhadas no formato dos erros do Laravel (`inspection.description`).
 */
export function useEditorFailure<TForm extends Record<string, any>>(
    form: InertiaFormProps<TForm>,
): {
    editorFailed: boolean;
    reportEditorFailure: (field: string, label: string) => void;
} {
    const [editorFailed, setEditorFailed] = useState(false);

    function reportEditorFailure(field: string, label: string): void {
        setEditorFailed(true);
        (form.setError as (key: string, message: string) => void)(
            field,
            `Não foi possível carregar o editor de ${label}. Atualize a página e tente novamente.`,
        );
    }

    return { editorFailed, reportEditorFailure };
}

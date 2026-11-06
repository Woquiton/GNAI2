import { fieldErrorId } from './fieldDescription';
import '@styles/components/Forms/FormField/FormField.css';

/**
 * Mensagem de erro de um controle que não usa `FormField` (checkbox isolado, grupo próprio).
 * Ligue o controle com `describedBy={fieldErrorId(id)}` quando houver erro.
 */
export default function FieldError({
    id,
    error,
}: {
    /** ID do controle; a mensagem recebe `${id}-error`. */
    id: string;
    error?: string;
}): React.JSX.Element | null {
    if (!error) {
        return null;
    }

    return (
        <span id={fieldErrorId(id)} className="formField__error">
            {error}
        </span>
    );
}

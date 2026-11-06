import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import TextInput from '@/components/Forms/TextInput/TextInput';

export type AccessPasswordField = 'password' | 'password_confirmation';

interface AccessPasswordFieldsProps {
    idPrefix: string;
    password: string;
    confirmation: string;
    error?: string;
    onChange: (field: AccessPasswordField, value: string) => void;
}

/**
 * Senha inicial opcional do cadastro. Sem senha, o backend mantém o envio do
 * link de definição de senha por e-mail.
 */
export default function AccessPasswordFields({
    idPrefix,
    password,
    confirmation,
    error,
    onChange,
}: AccessPasswordFieldsProps): React.JSX.Element {
    const confirmationId = `${idPrefix}-password-confirmation`;

    return (
        <FormGrid>
            <TextInputField
                id={`${idPrefix}-password`}
                name="password"
                type="password"
                label="Senha de acesso"
                hint="Mínimo de 8 caracteres, com letras e números. Deixe em branco para enviar por e-mail o link de definição de senha."
                autoComplete="new-password"
                minLength={8}
                maxLength={255}
                value={password}
                error={error}
                onChange={(value) => onChange('password', value)}
            />
            {/* A confirmação acompanha o erro da senha sem repetir a mensagem. */}
            <FormField id={confirmationId} label="Confirmar senha" hint="Repita a senha informada.">
                <TextInput
                    id={confirmationId}
                    name="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    maxLength={255}
                    value={confirmation}
                    invalid={Boolean(error)}
                    aria-describedby={fieldDescribedBy(confirmationId, { hint: true })}
                    onChange={(event) => onChange('password_confirmation', event.target.value)}
                />
            </FormField>
        </FormGrid>
    );
}

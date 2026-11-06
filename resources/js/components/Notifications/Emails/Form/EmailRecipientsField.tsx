import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import RemovableField from '@/components/Forms/RemovableField/RemovableField';
import RepeaterField from '@/components/Forms/RepeaterField/RepeaterField';
import TextInput from '@/components/Forms/TextInput/TextInput';

export default function EmailRecipientsField({
    id,
    name,
    label,
    value,
    error,
    hint,
    required = false,
    disabled,
    onChange,
}: {
    id: string;
    name: string;
    label: string;
    value: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled: boolean;
    onChange: (value: string) => void;
}): React.JSX.Element {
    const rows = value.split(/[,;\r\n]+/).map((email) => ({ email: email.trim() }));
    const description =
        hint ??
        'Use + E-mail para adicionar outro destinatário. Você também pode colar endereços separados por vírgula, ponto e vírgula ou quebra de linha.';

    return (
        <FormField
            id={id}
            label={label}
            error={error}
            hint={description}
            hintLabel={`Sobre os destinatários em ${label}`}
            requiredIndicator={required}
        >
            <div role="group" aria-label={`Destinatários em ${label}`}>
                <RepeaterField
                    items={rows}
                    variant="fields"
                    removePlacement="field"
                    addLabel="E-mail"
                    itemLabel={(index) => `${label}: e-mail ${index + 1}`}
                    disabled={disabled}
                    createItem={() => ({ email: '' })}
                    onChange={(items) => onChange(items.map((item) => item.email).join(', '))}
                    renderItem={(row, index, update, remove) => (
                        <RemovableField
                            removeLabel={`Remover e-mail ${index + 1} de ${label}`}
                            disabled={disabled}
                            onRemove={remove}
                        >
                            <TextInput
                                id={index === 0 ? id : `${id}-${index}`}
                                name={name}
                                inputMode="email"
                                aria-label={`${label}: e-mail ${index + 1}`}
                                placeholder="destinatario@exemplo.com"
                                autoComplete="email"
                                maxLength={4000}
                                value={row.email}
                                required={required && rows.length === 1}
                                disabled={disabled}
                                invalid={Boolean(error)}
                                aria-describedby={fieldDescribedBy(id, { error })}
                                onChange={(event) => update({ email: event.target.value })}
                                onPaste={(event) => {
                                    const text = event.clipboardData.getData('text');
                                    if (!/[,;\r\n]/.test(text)) {
                                        return;
                                    }
                                    event.preventDefault();
                                    const input = event.currentTarget;
                                    const start = input.selectionStart ?? input.value.length;
                                    const end = input.selectionEnd ?? start;
                                    update({
                                        email:
                                            input.value.slice(0, start) +
                                            text +
                                            input.value.slice(end),
                                    });
                                }}
                            />
                        </RemovableField>
                    )}
                />
            </div>
        </FormField>
    );
}

import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import TextInput, { type TextInputProps } from '@/components/Forms/TextInput/TextInput';
import type { FieldBaseProps } from './FormFields.types';

export type TextInputFieldProps = FieldBaseProps &
    Omit<
        TextInputProps,
        'id' | 'value' | 'onChange' | 'invalid' | 'required' | 'children' | 'readOnly'
    > & {
        value: string;
    } & (
        | { readOnly: true; onChange?: (value: string) => void }
        | { readOnly?: false; onChange: (value: string) => void }
    );

/** `FormField` + `TextInput`, com erro e descrição acessível já associados. */
export default function TextInputField({
    id,
    label,
    error,
    required = false,
    hint,
    hintLabel,
    fieldClassName,
    children,
    value,
    onChange,
    'aria-describedby': describedBy,
    ...inputProps
}: TextInputFieldProps): React.JSX.Element {
    return (
        <FormField
            id={id}
            label={label}
            error={error}
            hint={hint}
            hintLabel={hintLabel}
            className={fieldClassName}
            requiredIndicator={required}
        >
            <TextInput
                {...inputProps}
                id={id}
                value={value}
                required={required}
                invalid={Boolean(error)}
                aria-describedby={fieldDescribedBy(id, {
                    error,
                    hint: Boolean(hint && !hintLabel),
                    describedBy,
                })}
                onChange={(event) => onChange?.(event.target.value)}
            />
            {children}
        </FormField>
    );
}

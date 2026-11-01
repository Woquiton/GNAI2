import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import MaskedInput, { type MaskedInputProps } from '@/components/Forms/MaskedInput/MaskedInput';
import type { FieldBaseProps } from './FormFields.types';

export type MaskedInputFieldProps = FieldBaseProps &
    Omit<MaskedInputProps, 'id' | 'invalid' | 'required' | 'children'>;

/** `FormField` + `MaskedInput`; o valor é entregue por `onValueChange`. */
export default function MaskedInputField({
    id,
    label,
    error,
    required = false,
    hint,
    hintLabel,
    fieldClassName,
    children,
    'aria-describedby': describedBy,
    ...inputProps
}: MaskedInputFieldProps): React.JSX.Element {
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
            <MaskedInput
                {...inputProps}
                id={id}
                required={required}
                invalid={Boolean(error)}
                aria-describedby={fieldDescribedBy(id, {
                    error,
                    hint: Boolean(hint && !hintLabel),
                    describedBy,
                })}
            />
            {children}
        </FormField>
    );
}

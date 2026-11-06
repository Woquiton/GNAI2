import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import TextArea, { type TextAreaProps } from '@/components/Forms/TextArea/TextArea';
import type { FieldBaseProps } from './FormFields.types';

export type TextAreaFieldProps = FieldBaseProps &
    Omit<TextAreaProps, 'id' | 'value' | 'onChange' | 'invalid' | 'required' | 'children'> & {
        value: string;
        onChange: (value: string) => void;
    };

/** `FormField` + `TextArea` para textos simples, sem editor rico. */
export default function TextAreaField({
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
    ...textAreaProps
}: TextAreaFieldProps): React.JSX.Element {
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
            <TextArea
                {...textAreaProps}
                id={id}
                value={value}
                required={required}
                invalid={Boolean(error)}
                aria-describedby={fieldDescribedBy(id, {
                    error,
                    hint: Boolean(hint && !hintLabel),
                    describedBy,
                })}
                onChange={(event) => onChange(event.target.value)}
            />
            {children}
        </FormField>
    );
}

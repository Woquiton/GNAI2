import type { ComponentProps } from 'react';
import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import SelectField from '@/components/Forms/SelectField/SelectField';
import type { FieldBaseProps } from './FormFields.types';

type SelectFieldProps = ComponentProps<typeof SelectField>;

export type SelectInputFieldProps = FieldBaseProps &
    Omit<
        SelectFieldProps,
        'id' | 'label' | 'value' | 'onChange' | 'invalid' | 'required' | 'children' | 'multiple'
    > & {
        value: string;
        onChange: (value: string) => void;
    };

/**
 * `FormField` + `SelectField` (Select2 do Gnai) para seleção única.
 * Use `placeholder="Todos"` em filtros e o padrão "Selecione" em formulários.
 */
export default function SelectInputField({
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
    ...selectProps
}: SelectInputFieldProps): React.JSX.Element {
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
            <SelectField
                {...selectProps}
                id={id}
                label={label}
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

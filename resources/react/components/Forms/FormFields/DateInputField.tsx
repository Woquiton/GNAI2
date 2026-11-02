import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import DatePicker from '@/components/Forms/DatePicker/DatePicker';
import type { FieldBaseProps } from './FormFields.types';

export interface DateInputFieldProps extends FieldBaseProps {
    name: string;
    /** Data no formato do backend (`AAAA-MM-DD`). */
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

/** `FormField` + `DatePicker` (Bootstrap Datepicker local) com máscara dd/mm/aaaa. */
export default function DateInputField({
    id,
    label,
    error,
    required = false,
    hint,
    hintLabel,
    fieldClassName,
    children,
    name,
    value,
    onChange,
    disabled = false,
}: DateInputFieldProps): React.JSX.Element {
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
            <DatePicker
                id={id}
                name={name}
                label={label}
                value={value}
                required={required}
                disabled={disabled}
                invalid={Boolean(error)}
                describedBy={fieldDescribedBy(id, { error, hint: Boolean(hint && !hintLabel) })}
                onChange={onChange}
            />
            {children}
        </FormField>
    );
}

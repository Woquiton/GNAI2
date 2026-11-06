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
    /** Destaca o dia de hoje no calendário (padrão). */
    highlightToday?: boolean;
    /** Última data selecionável no calendário (`AAAA-MM-DD`). */
    maxDate?: string;
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
    highlightToday,
    maxDate,
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
                highlightToday={highlightToday}
                maxDate={maxDate}
                invalid={Boolean(error)}
                describedBy={fieldDescribedBy(id, { error, hint: Boolean(hint && !hintLabel) })}
                onChange={onChange}
            />
            {children}
        </FormField>
    );
}

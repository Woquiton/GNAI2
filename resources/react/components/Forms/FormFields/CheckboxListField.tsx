import ChoiceControl, { type ChoiceTone } from '@/components/Forms/ChoiceControl/ChoiceControl';
import ChoiceGroup from '@/components/Forms/ChoiceGroup/ChoiceGroup';
import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import type { FieldBaseProps, FieldOption } from './FormFields.types';

export interface CheckboxListFieldProps<T extends string | number> extends FieldBaseProps {
    /** Nome do array enviado ao backend; o sufixo `[]` é acrescentado automaticamente. */
    name: string;
    options: ReadonlyArray<FieldOption<T>>;
    value: readonly T[];
    onChange: (values: T[]) => void;
    tone?: ChoiceTone;
    disabled?: boolean;
    className?: string;
}

/** Grupo de checkboxes para seleção múltipla, como público-alvo e recursos de acessibilidade. */
export default function CheckboxListField<T extends string | number>({
    id,
    label,
    error,
    required = false,
    hint,
    hintLabel,
    fieldClassName,
    children,
    name,
    options,
    value,
    onChange,
    tone = 'purple',
    disabled = false,
    className,
}: CheckboxListFieldProps<T>): React.JSX.Element {
    function toggle(option: T, checked: boolean): void {
        onChange(checked ? [...value, option] : value.filter((selected) => selected !== option));
    }

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
            <ChoiceGroup
                id={id}
                label={label}
                className={className}
                invalid={Boolean(error)}
                describedBy={fieldDescribedBy(id, { error, hint: Boolean(hint && !hintLabel) })}
            >
                {options.map((option) => (
                    <ChoiceControl
                        key={option.value}
                        type="checkbox"
                        tone={tone}
                        id={`${id}-${option.value}`}
                        name={`${name}[]`}
                        label={option.label}
                        disabled={disabled}
                        checked={value.includes(option.value)}
                        onChange={(checked) => toggle(option.value, checked)}
                    />
                ))}
            </ChoiceGroup>
            {children}
        </FormField>
    );
}

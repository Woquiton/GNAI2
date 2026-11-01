import { joinClassNames } from '@/utils/joinClassNames';
import './ChoiceControl.css';

export type ChoiceType = 'checkbox' | 'radio';
export type ChoiceTone =
    | 'default'
    | 'custom'
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'purple'
    | 'pink'
    | 'inverse';

interface ChoiceControlProps {
    type: ChoiceType;
    id: string;
    label?: React.ReactNode;
    name?: string;
    tone?: ChoiceTone;
    checked?: boolean;
    disabled?: boolean;
    circle?: boolean;
    inline?: boolean;
    single?: boolean;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
    'aria-label'?: string;
    /** Mesmo contrato dos demais controles: estado inválido e descrição acessível. */
    invalid?: boolean;
    describedBy?: string;
    value?: string;
    onChange?: (checked: boolean) => void;
}

export default function ChoiceControl({
    type,
    id,
    label,
    name,
    tone = 'default',
    checked = false,
    disabled = false,
    circle = false,
    inline = false,
    single = false,
    className: customClassName,
    inputClassName,
    labelClassName,
    'aria-label': accessibleLabel,
    invalid = false,
    describedBy,
    value,
    onChange,
}: ChoiceControlProps): React.JSX.Element {
    const className = joinClassNames(
        type,
        `${type}-${tone}`,
        circle && `${type}-circle`,
        inline && `${type}-inline`,
        single && `${type}-single`,
        customClassName,
    );
    const fallbackLabel =
        typeof label === 'string' ? label || id : label === undefined ? id : undefined;

    return (
        <div className={className}>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                defaultChecked={onChange ? undefined : checked}
                checked={onChange ? checked : undefined}
                onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
                className={inputClassName}
                disabled={disabled}
                aria-label={accessibleLabel ?? fallbackLabel}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
            />
            <label htmlFor={id} className={labelClassName}>
                {label}
            </label>
        </div>
    );
}

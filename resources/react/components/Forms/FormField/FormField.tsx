import type { ReactNode } from 'react';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import { joinClassNames } from '@/utils/joinClassNames';
import { fieldErrorId, fieldHintId } from './fieldDescription';
import './FormField.css';

export interface FormFieldProps {
    /** ID do controle; o label, a dica e o erro são associados a ele. */
    id: string;
    label: string;
    children: ReactNode;
    layout?: 'stacked' | 'horizontal';
    /** Texto de apoio. Com `hintLabel`, é exibido no tooltip ao lado do label. */
    hint?: string;
    hintLabel?: string;
    error?: string;
    className?: string;
    requiredIndicator?: boolean;
}

function FormFieldLabel({
    id,
    label,
    required,
}: {
    id: string;
    label: string;
    required: boolean;
}): React.JSX.Element {
    return (
        <label className="formField__label" htmlFor={id}>
            {label}
            {required ? (
                <>
                    {' '}
                    <span className="formField__required">*</span>
                </>
            ) : null}
        </label>
    );
}

export default function FormField({
    id,
    label,
    children,
    layout = 'stacked',
    hint,
    hintLabel,
    error,
    className,
    requiredIndicator = false,
}: FormFieldProps): React.JSX.Element {
    const labelElement = <FormFieldLabel id={id} label={label} required={requiredIndicator} />;
    const inlineHint = hint && !hintLabel;

    return (
        <div className={joinClassNames('formField', `formField--${layout}`, className)}>
            {hint && hintLabel ? (
                <div className="formField__labelRow">
                    {labelElement}
                    <InfoTooltip text={hint} label={hintLabel} />
                </div>
            ) : (
                labelElement
            )}
            <div className="formField__control">
                {children}
                {inlineHint ? (
                    <span id={fieldHintId(id)} className="formField__hint">
                        {hint}
                    </span>
                ) : null}
                {error ? (
                    <label id={fieldErrorId(id)} htmlFor={id} className="formField__error">
                        {error}
                    </label>
                ) : null}
            </div>
        </div>
    );
}

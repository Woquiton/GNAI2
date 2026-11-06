import type { InputHTMLAttributes } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import '@styles/components/UI/Button/Button.css';
import '@styles/components/Forms/FileUploadButton/FileUploadButton.css';
export default function FileUploadButton({
    label,
    accept,
    onChange,
    disabled = false,
    ...props
}: {
    label: string;
    accept?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'>): React.JSX.Element {
    return (
        <label
            className={joinClassNames(
                'fileUploadButton button button--purple button--md button--width-md waves-effect waves-light',
                disabled && 'button--disabled',
            )}
            aria-disabled={disabled || undefined}
        >
            <span>
                <i className="ion-upload" aria-hidden="true" />
                {label}
            </span>
            <input
                {...props}
                type="file"
                aria-label={label}
                accept={accept}
                disabled={disabled}
                onChange={onChange}
            />
        </label>
    );
}

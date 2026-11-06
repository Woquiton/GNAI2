import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import '@styles/components/Forms/TextInput/TextInput.css';
import '@styles/components/Forms/TextArea/TextArea.css';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Mesmo contrato de `TextInput`; equivale a `aria-invalid`. */
    invalid?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
    { className, invalid, ...props },
    ref,
): React.JSX.Element {
    return (
        <textarea
            {...props}
            ref={ref}
            className={joinClassNames('textInput', 'textArea', className)}
            aria-invalid={invalid || props['aria-invalid'] || undefined}
        />
    );
});

export default TextArea;

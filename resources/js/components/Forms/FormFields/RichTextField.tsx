import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import SummernoteEditor from '@/components/Forms/SummernoteEditor/SummernoteEditor';
import type { SummernoteEditorProps } from '@/components/Forms/SummernoteEditor/SummernoteEditor.types';
import type { FieldBaseProps } from './FormFields.types';

export type RichTextFieldProps = FieldBaseProps &
    Omit<SummernoteEditorProps, 'id' | 'label' | 'invalid' | 'describedBy'>;

/**
 * `FormField` + `SummernoteEditor`. O editor cria a região editável `${id}-input`, que recebe o
 * label e a mensagem de erro. O valor inicial é lido somente na montagem (`defaultValue`).
 */
export default function RichTextField({
    id,
    label,
    error,
    required = false,
    hint,
    hintLabel,
    fieldClassName,
    children,
    ...editorProps
}: RichTextFieldProps): React.JSX.Element {
    const editableId = `${id}-input`;

    return (
        <FormField
            id={editableId}
            label={label}
            error={error}
            hint={hint}
            hintLabel={hintLabel}
            className={fieldClassName}
            requiredIndicator={required}
        >
            <SummernoteEditor
                {...editorProps}
                id={id}
                label={label}
                invalid={Boolean(error)}
                describedBy={fieldDescribedBy(editableId, {
                    error,
                    hint: Boolean(hint && !hintLabel),
                })}
            />
            {children}
        </FormField>
    );
}

import { RichTextField } from '@/components/Forms/FormFields/FormFields';
import type { CaseStudyRichTextSectionProps, CaseStudyTextField } from './CaseStudyForm.types';

interface CaseStudyRichTextFieldProps extends CaseStudyRichTextSectionProps {
    name: CaseStudyTextField;
    label: string;
    required?: boolean;
    /** Editor mais baixo para informações complementares. */
    compact?: boolean;
}

const fieldId = (name: string): string => `case-study-${name.replace(/_/g, '-')}`;

/** Editor rico de um campo de texto do Estudo de Caso, ligado ao estado do formulário. */
export default function CaseStudyRichTextField({
    form,
    errors,
    disabled,
    onEditorFailure,
    name,
    label,
    required = false,
    compact = false,
}: CaseStudyRichTextFieldProps): React.JSX.Element {
    return (
        <RichTextField
            id={fieldId(name)}
            label={label}
            required={required}
            error={errors[name]}
            height={compact ? 120 : 160}
            defaultValue={form.data[name]}
            disabled={disabled}
            onChange={(html) => form.setData(name, html)}
            onLoadError={() => onEditorFailure(name)}
        />
    );
}

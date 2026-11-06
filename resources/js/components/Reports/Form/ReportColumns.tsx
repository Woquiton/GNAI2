import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import ChoiceGroup from '@/components/Forms/ChoiceGroup/ChoiceGroup';
import FieldError from '@/components/Forms/FormField/FieldError';
import { fieldErrorId } from '@/components/Forms/FormField/fieldDescription';
import type { ReportOptions } from '../Reports.types';

/** Primeiro erro de colunas devolvido pelo backend (`columns` ou `columns.N`). */
function columnsError(errors: Record<string, string>): string | undefined {
    return (
        errors.columns || Object.entries(errors).find(([key]) => key.startsWith('columns.'))?.[1]
    );
}

/** Grade de checkboxes das informações (colunas) que entram no relatório. */
export default function ReportColumns({
    id,
    label,
    options,
    selected,
    errors,
    onChange,
}: {
    id: string;
    label: string;
    options: ReportOptions;
    selected: string[];
    errors: Record<string, string>;
    onChange: (key: string, checked: boolean) => void;
}): React.JSX.Element {
    const error = columnsError(errors);

    return (
        <div className="reportBuilder__columnGroup">
            <ChoiceGroup
                id={id}
                label={label}
                invalid={Boolean(error)}
                describedBy={error ? fieldErrorId(id) : undefined}
            >
                {Object.entries(options).map(([key, text], index) => (
                    <ChoiceControl
                        key={key}
                        type="checkbox"
                        id={`${id}-${index}`}
                        label={text}
                        tone="purple"
                        checked={selected.includes(key)}
                        onChange={(checked) => onChange(key, checked)}
                    />
                ))}
            </ChoiceGroup>
            <FieldError id={id} error={error} />
        </div>
    );
}

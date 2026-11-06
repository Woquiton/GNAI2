import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import ChoiceGroup from '@/components/Forms/ChoiceGroup/ChoiceGroup';
import FieldError from '@/components/Forms/FormField/FieldError';
import { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';

interface TeacherSelectionGroupProps {
    id: string;
    title: string;
    iconClass: string;
    name: string;
    options: Array<{ id: number; name: string }>;
    selected: readonly number[];
    error?: string;
    /** ID de erro da coleção, quando a mensagem já aparece no formulário pai. */
    errorId?: string;
    itemErrors?: Record<number, string | undefined>;
    disabled: boolean;
    onChange: (ids: number[], checked: boolean) => void;
    /** Valor de `data-tour` do bloco, usado pelo tutorial da tela. */
    tourTarget?: string;
}

/** Seleção por módulo ou curso, incluindo marcar/desmarcar todo o grupo. */
export default function TeacherSelectionGroup({
    id,
    title,
    iconClass,
    name,
    options,
    selected,
    error,
    errorId,
    itemErrors = {},
    disabled,
    onChange,
    tourTarget,
}: TeacherSelectionGroupProps): React.JSX.Element {
    const ids = options.map((option) => option.id);
    const allChecked = ids.length > 0 && ids.every((value) => selected.includes(value));
    const groupErrorId = error ? (errorId ?? `${id}-choices-error`) : undefined;
    const hasItemErrors = ids.some((value) => Boolean(itemErrors[value]));

    return (
        <FormSection
            id={id}
            title={title}
            variant="inline"
            iconClass={iconClass}
            tourTarget={tourTarget}
        >
            <FormStack>
                <ChoiceControl
                    id={`${id}-all`}
                    type="checkbox"
                    tone="purple"
                    label="Selecionar todas"
                    aria-label={`Selecionar todas: ${title}`}
                    checked={allChecked}
                    disabled={disabled || ids.length === 0}
                    onChange={(checked) => onChange(ids, checked)}
                />
                <ChoiceGroup
                    id={`${id}-choices`}
                    label={title}
                    invalid={Boolean(error) || hasItemErrors}
                    describedBy={groupErrorId}
                >
                    {options.map((option) => {
                        const inputId = `${id}-${option.id}`;
                        const inputError = itemErrors[option.id] ?? error;
                        const describedBy = itemErrors[option.id]
                            ? `${inputId}-error`
                            : groupErrorId;

                        return (
                            <div key={option.id}>
                                <ChoiceControl
                                    id={inputId}
                                    name={`${name}[]`}
                                    value={String(option.id)}
                                    type="checkbox"
                                    tone="purple"
                                    label={option.name}
                                    checked={selected.includes(option.id)}
                                    disabled={disabled}
                                    invalid={Boolean(inputError)}
                                    describedBy={describedBy}
                                    onChange={(checked) => onChange([option.id], checked)}
                                />
                                <FieldError id={inputId} error={itemErrors[option.id]} />
                            </div>
                        );
                    })}
                </ChoiceGroup>
                {!errorId ? <FieldError id={`${id}-choices`} error={error} /> : null}
            </FormStack>
        </FormSection>
    );
}

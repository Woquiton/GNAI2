import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import type { SelectFieldOption } from '@/components/Forms/SelectField/SelectField.types';
import '@styles/components/Forms/TextInput/TextInput.css';
import '@styles/components/Forms/CheckboxSelect/CheckboxSelect.css';

interface CheckboxSelectProps {
    id: string;
    name: string;
    label: string;
    options: SelectFieldOption[];
    value: string;
    error?: string;
    onChange: (value: string) => void;
}

/** Mantém a seleção local e comunica os valores apenas ao fechar o seletor. */
export default function CheckboxSelect({
    id,
    name,
    label,
    options,
    value,
    error,
    onChange,
}: CheckboxSelectProps): React.JSX.Element {
    const menu = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<CSSProperties>({});
    const root = useRef<HTMLDivElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(value);
    const draftRef = useRef(value);
    const changeRef = useRef(onChange);
    changeRef.current = onChange;
    const valueRef = useRef(value);
    valueRef.current = value;

    useEffect(() => {
        setDraft(value);
        draftRef.current = value;
    }, [value]);

    useLayoutEffect(() => {
        if (!open || !menu.current || !trigger.current) return;
        const popup = menu.current;
        function place(): void {
            const rect = trigger.current?.getBoundingClientRect();
            if (!rect) return;
            const below = window.innerHeight - rect.bottom - 12;
            const above = rect.top - 12;
            const upwards = below < 200 && above > below;
            setPosition({
                left: Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)),
                width: Math.min(rect.width, window.innerWidth - 16),
                top: upwards ? undefined : rect.bottom + 4,
                bottom: upwards ? window.innerHeight - rect.top + 4 : undefined,
                maxHeight: Math.max(60, Math.min(280, upwards ? above : below)),
            });
        }
        place();
        popup.showPopover();
        window.addEventListener('resize', place);
        window.addEventListener('scroll', place, true);
        return () => {
            window.removeEventListener('resize', place);
            window.removeEventListener('scroll', place, true);
            if (popup.matches(':popover-open')) popup.hidePopover();
        };
    }, [open]);

    function close(): void {
        setOpen(false);
        if (draftRef.current !== valueRef.current) {
            valueRef.current = draftRef.current;
            changeRef.current(draftRef.current);
        }
    }

    useEffect(() => {
        if (!open) return;
        function outside(event: PointerEvent): void {
            if (event.target instanceof Node && !root.current?.contains(event.target)) {
                setOpen(false);
                if (draftRef.current !== valueRef.current) {
                    valueRef.current = draftRef.current;
                    changeRef.current(draftRef.current);
                }
            }
        }
        document.addEventListener('pointerdown', outside);
        return () => document.removeEventListener('pointerdown', outside);
    }, [open]);

    const selected = draft.split(',').filter(Boolean);
    const selectedLabels = options.filter((option) => selected.includes(option.value));
    const summary = selectedLabels.length
        ? selectedLabels.map((option) => option.label).join(', ')
        : 'Todos';

    return (
        <FormField id={id} label={label} error={error}>
            <div
                ref={root}
                className="checkboxSelect"
                onBlur={(event) => {
                    if (open && !event.currentTarget.contains(event.relatedTarget)) close();
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Escape' && open) {
                        event.preventDefault();
                        event.stopPropagation();
                        close();
                        trigger.current?.focus();
                    }
                }}
            >
                <input type="hidden" name={name} value={value} />
                <button
                    ref={trigger}
                    id={id}
                    type="button"
                    className="textInput checkboxSelect__trigger"
                    data-filter-name={name}
                    data-filter-value={value}
                    aria-expanded={open}
                    aria-controls={`${id}-options`}
                    aria-invalid={Boolean(error)}
                    aria-describedby={fieldDescribedBy(id, { error })}
                    title={summary}
                    onClick={() => {
                        if (open) close();
                        else setOpen(true);
                    }}
                >
                    <span>{summary}</span>
                    <span aria-hidden="true">▾</span>
                </button>
                {open ? (
                    <div
                        ref={menu}
                        popover="manual"
                        style={position}
                        id={`${id}-options`}
                        className="checkboxSelect__options"
                        role="group"
                        aria-label={label}
                    >
                        <p className="checkboxSelect__hint">
                            Marque os perfis. Clique fora para pesquisar.
                        </p>
                        {options.map((option) => (
                            <ChoiceControl
                                key={option.value}
                                type="checkbox"
                                id={`${id}-${option.value}`}
                                label={option.label}
                                checked={selected.includes(option.value)}
                                onChange={(checked) => {
                                    const next = checked
                                        ? [...selected, option.value]
                                        : selected.filter((item) => item !== option.value);
                                    draftRef.current = next.join(',');
                                    setDraft(draftRef.current);
                                }}
                            />
                        ))}
                        {options.length === 0 ? <p>Nenhum perfil disponível.</p> : null}
                    </div>
                ) : null}
            </div>
        </FormField>
    );
}

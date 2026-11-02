import { useEffect, useRef, useState } from 'react';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { loadExternalScript } from '@/utils/loadExternalScript';
import { loadExternalStylesheet } from '@/utils/loadExternalStylesheet';
import { maskTime, timeCaret } from '@/components/Forms/TimePicker/TimePicker.utils';
import './ClockPicker.css';

interface ClockPickerCollection {
    clockpicker: (options?: Record<string, unknown> | string) => ClockPickerCollection;
    data: (key: string) => ClockPickerWidget | undefined;
    on: (events: string, callback: () => void) => ClockPickerCollection;
    off: (events: string) => ClockPickerCollection;
}

interface ClockPickerWidget {
    hours: number;
    minutes: number;
    spanHours: { html: (value: string) => void };
    spanMinutes: { html: (value: string) => void };
    toggleView: (view: 'hours' | 'minutes') => void;
}

export interface ClockPickerProps {
    id: string;
    label: string;
    name?: string;
    /** Valor inicial (`HH:mm`), lido na montagem quando `value` não é informado. */
    defaultValue?: string;
    /**
     * Valor controlado (`HH:mm` ou vazio). Alterações externas atualizam o campo e o relógio;
     * a digitação incompleta não é apagada pelo valor vazio que o próprio campo emite.
     */
    value?: string;
    required?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    describedBy?: string;
    onChange?: (value: string) => void;
    /** Falha ao carregar o plugin; o campo continua aceitando digitação com máscara. */
    onLoadError?: () => void;
}

function completeTime(value: string | undefined): string {
    const result = maskTime(value ?? '');

    return result.valid && result.complete ? result.value : '';
}

export default function ClockPicker({
    id,
    label,
    name,
    defaultValue,
    value,
    required = false,
    disabled = false,
    invalid = false,
    describedBy,
    onChange,
    onLoadError,
}: ClockPickerProps): React.JSX.Element {
    const input = useRef<HTMLInputElement>(null);
    const picker = useRef<ClockPickerWidget | null>(null);
    const callback = useRef(onChange);
    const loadErrorCallback = useRef(onLoadError);
    const [display, setDisplay] = useState(() => completeTime(value ?? defaultValue));
    const [invalidEntry, setInvalidEntry] = useState(false);
    const lastValid = useRef(display);
    const applyTimeRef = useRef<(rawValue: string) => void>(() => undefined);
    callback.current = onChange;
    loadErrorCallback.current = onLoadError;

    function syncDial(value: string): void {
        const widget = picker.current;
        if (!widget) return;

        const [hourPart = '', minutePart = ''] = value.split(':');
        const hour = Number(hourPart);
        const minute = Number(minutePart);
        if (hourPart.length > 0 && Number.isFinite(hour)) {
            widget.hours = hour;
            widget.spanHours.html(String(hour).padStart(2, '0'));
        }
        if (minutePart.length > 0 && Number.isFinite(minute)) {
            widget.minutes = minute;
            widget.spanMinutes.html(String(minute).padStart(2, '0'));
        }

        widget.toggleView(minutePart.length > 0 || value.includes(':') ? 'minutes' : 'hours');
    }

    function applyTime(rawValue: string, caret?: number): void {
        const result = maskTime(rawValue);
        if (!result.valid) {
            setInvalidEntry(true);
            setDisplay(lastValid.current);
            callback.current?.(lastValid.current);
            return;
        }

        setInvalidEntry(false);
        lastValid.current = result.value;
        setDisplay(result.value);
        syncDial(result.value);
        callback.current?.(result.complete ? result.value : '');

        if (caret !== undefined) {
            const digitCount = rawValue.slice(0, caret).replace(/\D/g, '').length;
            requestAnimationFrame(() => {
                if (document.activeElement === input.current) {
                    const nextCaret = timeCaret(
                        result.value,
                        digitCount,
                        caret === rawValue.length,
                    );
                    input.current?.setSelectionRange(nextCaret, nextCaret);
                }
            });
        }
    }

    applyTimeRef.current = (rawValue: string) => applyTime(rawValue);

    useEffect(() => {
        if (value === undefined) {
            return;
        }

        const next = completeTime(value);
        const current = completeTime(lastValid.current);

        if (next === current || (next === '' && !current)) {
            return;
        }

        lastValid.current = next;
        setDisplay(next);
        setInvalidEntry(false);
        applyTimeRef.current(next);
    }, [value]);

    useEffect(() => {
        let disposed = false;
        let instance: ClockPickerCollection | undefined;

        async function initialize(): Promise<void> {
            await loadExternalStylesheet(
                '/assets/react/plugins/clockpicker/jquery-clockpicker.min.css',
            );
            await loadExternalScript('/assets/react/js/jquery.min.js');
            await loadExternalScript('/assets/react/plugins/clockpicker/jquery-clockpicker.min.js');
            if (disposed || !input.current) return;

            const $ = (
                window as unknown as {
                    jQuery: (element: HTMLElement) => ClockPickerCollection;
                }
            ).jQuery;
            instance = $(input.current);
            instance.clockpicker({
                twelvehour: false,
                autoclose: false,
                default: lastValid.current,
                donetext: 'Concluído',
            });
            picker.current = instance.data('clockpicker') ?? null;
            instance.on('change.clockpicker.react', () =>
                applyTimeRef.current(input.current?.value ?? ''),
            );
        }

        initialize().catch(() => {
            if (!disposed) {
                loadErrorCallback.current?.();
            }
        });
        return () => {
            disposed = true;
            picker.current = null;
            instance?.off('.react');
            instance?.clockpicker('remove');
        };
    }, []);

    const description = invalidEntry ? `${id}-time-error` : undefined;

    return (
        <div className="clockPicker">
            <div className="input-group">
                <TextInput
                    ref={input}
                    id={id}
                    name={name}
                    aria-label={label}
                    className="form-control"
                    value={display}
                    required={required}
                    disabled={disabled}
                    inputMode="numeric"
                    autoComplete="off"
                    invalid={invalid || invalidEntry}
                    aria-describedby={
                        [describedBy, description].filter(Boolean).join(' ') || undefined
                    }
                    onChange={(event) =>
                        applyTime(
                            event.currentTarget.value,
                            event.currentTarget.selectionStart ?? event.currentTarget.value.length,
                        )
                    }
                />
                <span className="input-group-addon" aria-hidden="true">
                    <i className="glyphicon glyphicon-time" />
                </span>
            </div>
            {invalidEntry ? (
                <span id={`${id}-time-error`} role="alert" className="clockPicker__error">
                    Informe um horário entre 00:00 e 23:59.
                </span>
            ) : null}
        </div>
    );
}

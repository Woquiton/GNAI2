import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Button from '@/components/UI/Button/Button';
import { loadExternalScript } from '@/utils/loadExternalScript';
import { loadExternalStylesheet } from '@/utils/loadExternalStylesheet';
import './ColorPicker.css';

interface PickerCollection {
    colorpicker: (options: Record<string, unknown> | string, value?: string) => PickerCollection;
    on: (
        events: string,
        handler: (event: { color?: { toHex: () => string } }) => void,
    ) => PickerCollection;
    off: (events: string) => PickerCollection;
}

export default function ColorPicker({
    id,
    name,
    label,
    value,
    disabled = false,
    invalid = false,
    describedBy,
    onChange,
}: {
    id: string;
    name: string;
    label: string;
    value: string;
    disabled?: boolean;
    invalid?: boolean;
    describedBy?: string;
    onChange: (value: string) => void;
}): React.JSX.Element {
    const host = useRef<HTMLDivElement>(null);
    const picker = useRef<PickerCollection | null>(null);
    const latest = useRef({ value, disabled, onChange });
    latest.current = { value, disabled, onChange };
    const synchronizing = useRef(false);
    const [ready, setReady] = useState(false);
    const [loadFailed, setLoadFailed] = useState(false);
    const [open, setOpen] = useState(false);
    const validColor = /^#[0-9a-f]{6}$/i.test(value) ? value : '#322b75';

    useEffect(() => {
        let disposed = false;
        let instance: PickerCollection | undefined;
        let initialized = false;
        async function initialize(): Promise<void> {
            await Promise.all([
                loadExternalStylesheet(
                    '/assets/react/plugins/mjolnic-bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css',
                ),
                loadExternalScript('/assets/react/js/jquery.min.js'),
            ]);
            await loadExternalScript(
                '/assets/react/plugins/mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js',
            );
            if (disposed || !host.current) {
                return;
            }
            const runtime = (
                window as unknown as { jQuery: (element: HTMLElement) => PickerCollection }
            ).jQuery;
            instance = runtime(host.current);
            instance.colorpicker({
                format: 'hex',
                color: latest.current.value,
                input: false,
                component: false,
                container: host.current,
                customClass: 'colorPicker__palette',
            });
            initialized = true;
            // O botão controla a abertura; o campo hexadecimal permanece sob controle do React.
            instance.off('click.colorpicker');
            const panel = host.current.querySelector<HTMLElement>('.colorpicker');
            panel?.setAttribute('id', `${id}-palette`);
            panel?.setAttribute('role', 'group');
            panel?.setAttribute('aria-label', `Paleta: ${label}`);
            panel?.setAttribute('aria-hidden', 'true');
            instance.on('changeColor.gnaiColorPicker', (event) => {
                if (synchronizing.current || latest.current.disabled) {
                    return;
                }
                const color = event.color?.toHex();
                if (color && /^#[0-9a-f]{6}$/i.test(color)) {
                    latest.current.onChange(color.toLowerCase());
                }
            });
            instance.on('showPicker.gnaiColorPicker', () => {
                panel?.setAttribute('aria-hidden', 'false');
                setOpen(true);
            });
            instance.on('hidePicker.gnaiColorPicker', () => {
                panel?.setAttribute('aria-hidden', 'true');
                if (!disposed) {
                    setOpen(false);
                }
            });
            picker.current = instance;
            setReady(true);
        }
        void initialize().catch(() => {
            instance?.off('.gnaiColorPicker');
            if (initialized) {
                instance?.colorpicker('hide');
                instance?.colorpicker('destroy');
                initialized = false;
            }
            if (!disposed) {
                setLoadFailed(true);
            }
        });
        return () => {
            disposed = true;
            picker.current = null;
            instance?.off('.gnaiColorPicker');
            if (initialized) {
                instance?.colorpicker('hide');
                instance?.colorpicker('destroy');
            }
        };
    }, [id, label]);

    useEffect(() => {
        if (!ready || !picker.current) {
            return;
        }
        synchronizing.current = true;
        picker.current.colorpicker('setValue', validColor);
        if (disabled) {
            picker.current.colorpicker('hide');
        }
        synchronizing.current = false;
    }, [ready, validColor, disabled]);

    function closeOnEscape(event: KeyboardEvent<HTMLElement>): void {
        if (event.key !== 'Escape' || !open) {
            return;
        }
        event.stopPropagation();
        picker.current?.colorpicker('hide');
        host.current?.querySelector<HTMLButtonElement>('.colorPicker__trigger')?.focus();
    }

    return (
        <div ref={host} className="colorPicker" role="group" aria-label={`Seletor: ${label}`}>
            <TextInput
                id={id}
                name={name}
                value={value}
                disabled={disabled}
                invalid={invalid}
                maxLength={7}
                autoComplete="off"
                aria-label={label}
                aria-describedby={describedBy}
                placeholder="#322b75"
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={closeOnEscape}
            />
            <span
                className="colorPicker__swatch"
                style={{ backgroundColor: validColor }}
                aria-hidden="true"
            />
            <Button
                className="colorPicker__trigger"
                tone="white"
                iconOnly
                leftIconClass="fa fa-eyedropper"
                title={`Escolher ${label.toLowerCase()}`}
                aria-label={`Escolher ${label.toLowerCase()}`}
                aria-expanded={open}
                aria-controls={ready ? `${id}-palette` : undefined}
                disabled={disabled || !ready}
                onMouseDown={(event) => event.stopPropagation()}
                onKeyDown={closeOnEscape}
                onClick={() => picker.current?.colorpicker(open ? 'hide' : 'show')}
            />
            {loadFailed ? (
                <>
                    <TextInput
                        type="color"
                        value={validColor}
                        disabled={disabled}
                        aria-label={`Selecionar ${label.toLowerCase()} com o seletor nativo`}
                        onChange={(event) => onChange(event.target.value)}
                    />
                    <span className="colorPicker__fallback" role="status">
                        A paleta não carregou. Digite a cor ou use o seletor nativo.
                    </span>
                </>
            ) : null}
        </div>
    );
}

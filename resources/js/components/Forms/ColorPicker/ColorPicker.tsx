import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import InputAction from '@/components/Forms/InputAction/InputAction';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Button from '@/components/UI/Button/Button';
import { loadExternalScript } from '@/utils/loadExternalScript';
import { loadExternalStylesheet } from '@/utils/loadExternalStylesheet';
import '@styles/components/Forms/ColorPicker/ColorPicker.css';

interface PickerCollection {
    colorpicker: (options: Record<string, unknown> | string, value?: string) => PickerCollection;
    on: (
        events: string,
        handler: (event: { color?: { toHex: () => string } }) => void,
    ) => PickerCollection;
    off: (events: string) => PickerCollection;
}

const DEFAULT_COLOR = '#322b75';

/** Lê a cor enquanto é digitada: com ou sem "#", em 3 ou 6 dígitos hexadecimais. */
function parseHexColor(value: string): string | null {
    const digits = value.trim().replace(/^#/, '').toLowerCase();
    if (/^[0-9a-f]{6}$/.test(digits)) return `#${digits}`;
    if (/^[0-9a-f]{3}$/.test(digits)) {
        return `#${digits
            .split('')
            .map((digit) => digit + digit)
            .join('')}`;
    }
    return null;
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
    const parsedColor = parseHexColor(value);
    // Enquanto o código está incompleto, a amostra e a paleta mantêm a última cor válida.
    const [lastColor, setLastColor] = useState(parsedColor ?? DEFAULT_COLOR);
    if (parsedColor && parsedColor !== lastColor) setLastColor(parsedColor);
    const validColor = parsedColor ?? lastColor;

    useEffect(() => {
        let disposed = false;
        let instance: PickerCollection | undefined;
        let initialized = false;
        async function initialize(): Promise<void> {
            await Promise.all([
                loadExternalStylesheet(
                    '/assets/plugins/mjolnic-bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css',
                ),
                loadExternalScript('/assets/js/jquery.min.js'),
            ]);
            await loadExternalScript(
                '/assets/plugins/mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js',
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
                // Abre para a esquerda, com a seta do lado direito, apontando para o botão colado.
                align: 'right',
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

    // Modelo "As Component" do Ubold: botão branco colado ao campo, com a amostra da cor dentro.
    const trigger = (
        <Button
            className="colorPicker__trigger"
            tone="white"
            iconOnly
            showIcon={false}
            waves={false}
            title={`Escolher ${label.toLowerCase()}`}
            aria-label={`Escolher ${label.toLowerCase()}`}
            aria-expanded={open}
            aria-controls={ready ? `${id}-palette` : undefined}
            disabled={disabled || !ready}
            onMouseDown={(event) => event.stopPropagation()}
            onKeyDown={closeOnEscape}
            onClick={() => picker.current?.colorpicker(open ? 'hide' : 'show')}
        >
            <i
                className="colorPicker__swatch"
                style={{ backgroundColor: validColor }}
                aria-hidden="true"
            />
        </Button>
    );

    return (
        <div ref={host} className="colorPicker" role="group" aria-label={`Seletor: ${label}`}>
            <InputAction
                id={id}
                name={name}
                value={value}
                disabled={disabled}
                invalid={invalid}
                maxLength={7}
                autoComplete="off"
                aria-label={label}
                aria-describedby={describedBy}
                placeholder={DEFAULT_COLOR}
                onChange={(event) => onChange(event.target.value)}
                onBlur={() => {
                    // Completa o formato aceito pelo servidor (#rrggbb) ao sair do campo.
                    if (parsedColor && parsedColor !== value) onChange(parsedColor);
                }}
                onKeyDown={closeOnEscape}
                onClick={() => {
                    // Como no Ubold, clicar no campo também abre a paleta.
                    if (ready && !disabled && !open) picker.current?.colorpicker('show');
                }}
                button={trigger}
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

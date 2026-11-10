import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePage } from '@inertiajs/react';
import Modal from '@/components/UI/Modal/Modal';
import Button from '@/components/UI/Button/Button';
import SiteAccessibilityTool from './SiteAccessibilityTool';
import SiteReadingMask from './SiteReadingMask';
import {
    DEFAULT_SITE_ACCESSIBILITY,
    SITE_TEXT_SCALES,
    type SiteAccessibilityPreferences,
} from './useSiteAccessibilityPreferences';
import '@styles/components/Website/SiteAccessibility/SiteAccessibility.css';

const ALIGNMENTS = ['Padrão', 'À esquerda', 'Centralizado', 'À direita'];
const LINE_HEIGHTS = ['Padrão', '1,3×', '1,6×', '2×'];
const CONTRASTS = ['Padrão', 'Escuro', 'Claro', 'Alto contraste'];

export default function SiteAccessibility({
    preferences: reading,
    onChange,
}: {
    preferences: SiteAccessibilityPreferences;
    onChange: (next: SiteAccessibilityPreferences) => void;
}): React.JSX.Element {
    const [open, setOpen] = useState(false);
    const [structureOpen, setStructureOpen] = useState(false);
    const [headings, setHeadings] = useState<HTMLElement[]>([]);
    const [destination, setDestination] = useState<HTMLElement | null>(null);
    const { url } = usePage();
    const previousStructure = useRef(false);

    useEffect(() => {
        setOpen(false);
        setDestination(null);
    }, [url]);

    useEffect(() => {
        if (!open) return;
        setHeadings(Array.from(
            document.querySelectorAll<HTMLElement>(
                '.siteLayout__main :is(h1, h2, h3, h4, h5, h6)',
            ),
        ).filter((heading) =>
            !!heading.textContent?.trim()
            && heading.getClientRects().length > 0
            && !heading.closest('[inert], [aria-hidden="true"]'),
        ));
    }, [open]);

    useEffect(() => {
        if (!open) {
            previousStructure.current = false;
            return;
        }
        if (previousStructure.current === structureOpen) return;
        previousStructure.current = structureOpen;
        const frame = requestAnimationFrame(() => {
            const selector = structureOpen
                ? '.siteAccessibility__back'
                : '[aria-controls="site-accessibility-headings"]';
            document.querySelector<HTMLElement>('.siteAccessibilityLayer ' + selector)?.focus();
        });
        return () => cancelAnimationFrame(frame);
    }, [open, structureOpen]);

    // O Modal devolve o foco ao disparador ao terminar de fechar; só então seguimos ao título.
    useEffect(() => {
        if (open || !destination) return;
        let frame = 0;
        const focus = (): void => {
            if (document.querySelector('.siteAccessibilityLayer')) {
                frame = requestAnimationFrame(focus);
                return;
            }
            if (destination.isConnected) {
                destination.setAttribute('tabindex', '-1');
                destination.focus({ preventScroll: true });
                destination.scrollIntoView({ block: 'start', behavior: 'auto' });
            }
            setDestination(null);
        };
        frame = requestAnimationFrame(focus);
        return () => cancelAnimationFrame(frame);
    }, [destination, open]);

    function toggle(key: Exclude<keyof SiteAccessibilityPreferences, 'lineHeight' | 'alignment' | 'scale' | 'contrast'>): void {
        onChange({ ...reading, [key]: !reading[key] });
    }

    function reset(): void {
        onChange({ ...DEFAULT_SITE_ACCESSIBILITY });
        setStructureOpen(false);
    }

    const scaleIndex = SITE_TEXT_SCALES.indexOf(reading.scale as typeof SITE_TEXT_SCALES[number]);
    const changed = Object.entries(reading).some(
        ([key, value]) =>
            value !== DEFAULT_SITE_ACCESSIBILITY[key as keyof SiteAccessibilityPreferences],
    );

    return createPortal(
        <>
            <button
                type="button"
                className="siteAccessibility__launcher"
                aria-label="Abrir menu de acessibilidade"
                aria-haspopup="dialog"
                aria-expanded={open}
                title="Menu de acessibilidade"
                onClick={() => {
                    setStructureOpen(false);
                    setOpen(true);
                }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    focusable="false"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="4" r="2" />
                    <path d="M4 9h16M12 9v6M12 15l-4 7M12 15l4 7" />
                </svg>
                {changed ? <span className="siteAccessibility__indicator" aria-hidden="true" /> : null}
            </button>
            {reading.readingMask && !open ? <SiteReadingMask /> : null}
            <Modal
                open={open}
                title={structureOpen ? 'Estrutura da página' : 'Menu de acessibilidade'}
                onClose={() => setOpen(false)}
                layerClassName="siteAccessibilityLayer"
                className="siteAccessibility__dialog"
            >
                <p className="siteAccessibility__intro" hidden={structureOpen}>
                    Ajuste a leitura do seu jeito.
                </p>
                <div className="siteAccessibility__tools" hidden={structureOpen}>
                    <div className="siteAccessibility__tool siteAccessibility__textSize">
                        <i className="fa fa-text-height siteAccessibility__toolIcon" aria-hidden="true" />
                        <span className="siteAccessibility__toolLabel">Tamanho do texto</span>
                        <div className="siteAccessibility__sizeControls">
                            <button
                                type="button"
                                title="Diminuir tamanho"
                                aria-label="Diminuir tamanho do texto e da interface"
                                disabled={scaleIndex <= 0}
                                onClick={() => onChange({ ...reading, scale: SITE_TEXT_SCALES[scaleIndex - 1] })}
                            >
                                −
                            </button>
                            <output aria-live="polite" aria-label="Tamanho atual">
                                {reading.scale}%
                            </output>
                            <button
                                type="button"
                                title="Aumentar tamanho"
                                aria-label="Aumentar tamanho do texto e da interface"
                                disabled={scaleIndex >= SITE_TEXT_SCALES.length - 1}
                                onClick={() => onChange({ ...reading, scale: SITE_TEXT_SCALES[scaleIndex + 1] })}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <SiteAccessibilityTool
                        label="Espaçamento entre linhas"
                        icon="fa fa-arrows-v"
                        active={reading.lineHeight > 0}
                        value={LINE_HEIGHTS[reading.lineHeight]}
                        onClick={() => onChange({ ...reading, lineHeight: (reading.lineHeight + 1) % 4 })}
                    />
                    <SiteAccessibilityTool
                        label="Alinhamento do texto"
                        icon="fa fa-align-left"
                        active={reading.alignment > 0}
                        value={ALIGNMENTS[reading.alignment]}
                        onClick={() => onChange({ ...reading, alignment: (reading.alignment + 1) % 4 })}
                    />
                    <SiteAccessibilityTool
                        label="Fonte simples"
                        icon="fa fa-font"
                        active={reading.readableFont}
                        onClick={() => toggle('readableFont')}
                    />
                    <SiteAccessibilityTool
                        label="Contraste"
                        icon="fa fa-adjust"
                        active={reading.contrast > 0}
                        value={CONTRASTS[reading.contrast]}
                        onClick={() => onChange({ ...reading, contrast: (reading.contrast + 1) % 4 })}
                    />
                    <SiteAccessibilityTool
                        label="Tons de cinza"
                        icon="fa fa-tint"
                        active={reading.grayscale}
                        onClick={() => toggle('grayscale')}
                    />
                    <SiteAccessibilityTool
                        label="Máscara de leitura"
                        icon="fa fa-book"
                        active={reading.readingMask}
                        onClick={() => toggle('readingMask')}
                    />
                    <SiteAccessibilityTool
                        label="Ocultar imagens"
                        icon="fa fa-picture-o"
                        active={reading.hideImages}
                        onClick={() => toggle('hideImages')}
                    />
                    <SiteAccessibilityTool
                        label="Pausar animações"
                        icon="fa fa-pause"
                        active={reading.pauseMotion}
                        onClick={() => toggle('pauseMotion')}
                    />
                    <SiteAccessibilityTool
                        label="Destacar links"
                        icon="fa fa-link"
                        active={reading.highlightLinks}
                        onClick={() => toggle('highlightLinks')}
                    />
                    <SiteAccessibilityTool
                        label="Destacar foco"
                        icon="fa fa-crosshairs"
                        active={reading.strongFocus}
                        onClick={() => toggle('strongFocus')}
                    />
                    <SiteAccessibilityTool
                        label="Estrutura da página"
                        icon="fa fa-list-ol"
                        active={structureOpen}
                        value={structureOpen ? 'Ocultar títulos' : 'Ver títulos'}
                        expanded={structureOpen}
                        controls="site-accessibility-headings"
                        onClick={() => setStructureOpen((value) => !value)}
                    />
                </div>
                <nav
                    id="site-accessibility-headings"
                    hidden={!structureOpen}
                    aria-label="Títulos da página"
                    className="siteAccessibility__structure"
                >
                    <Button
                        tone="white"
                        size="sm"
                        className="siteAccessibility__back"
                        label="Voltar às ferramentas"
                        title="Voltar às ferramentas de acessibilidade"
                        leftIconClass="fa fa-arrow-left"
                        onClick={() => setStructureOpen(false)}
                    />
                    <h2>Escolha um título</h2>
                    <p className="siteAccessibility__structureHint">
                        H1 identifica o título principal; H2 a H6 organizam as seções e subseções.
                        Escolha um título para ir até ele.
                    </p>
                    {headings.length ? (
                        <ul>
                            {headings.map((heading, index) => {
                                const level = Number(heading.tagName.slice(1));
                                const label = heading.textContent?.trim() ?? '';
                                const description = 'Ir para ' + label + ', título de nível ' + level;

                                return (
                                    <li
                                        key={index}
                                        style={{ marginInlineStart: (level - 1) * 8 }}
                                    >
                                        <button
                                            type="button"
                                            title={description}
                                            aria-label={description}
                                            onClick={() => {
                                                setDestination(heading);
                                                setOpen(false);
                                            }}
                                        >
                                            <span
                                                className="siteAccessibility__headingLevel"
                                                aria-hidden="true"
                                            >
                                                H{level}
                                            </span>
                                            <span className="siteAccessibility__headingText">
                                                {label}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : <p>Nenhum título disponível nesta página.</p>}
                </nav>
                <Button
                    tone="list-action"
                    block
                    label="Restaurar configurações"
                    title="Restaurar todas as opções de acessibilidade"
                    leftIconClass="fa fa-undo"
                    className="siteAccessibility__reset"
                    onClick={reset}
                />
            </Modal>
        </>,
        document.body,
    );
}

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@inertiajs/react';
import Button from '@/components/UI/Button/Button';
import { joinClassNames } from '@/utils/joinClassNames';
import type { GuidedTourDefinition, GuidedTourStep } from './GuidedTour.types';
import GuidedTourTrail from './GuidedTourTrail';
import {
    computeTourLayout,
    enclosingRect,
    findTourTargets,
    isTourStepAvailable,
    topBarOffset,
    type TourLayout,
} from './guidedTourLayout';
import '@styles/components/UI/GuidedTour/GuidedTour.css';

/** Tamanho previsto do cartão antes da primeira medição. */
const FALLBACK_CARD_SIZE = { width: 360, height: 280 };

const FINISH_STEP: GuidedTourStep = {
    id: 'guided-tour-finish',
    title: 'Pronto!',
    content: [
        'Você chegou ao fim do tutorial desta tela.',
        'Para ver de novo, clique no botão com o ícone de informação, na barra do topo.',
    ],
};

interface GuidedTourProps {
    tour: GuidedTourDefinition;
    onClose: () => void;
}

function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Leva o alvo para a área visível; alvos altos ficam alinhados ao topo, os demais ao centro. */
function revealTargets(targets: HTMLElement[]): void {
    const rect = enclosingRect(targets);

    if (!rect) {
        return;
    }

    targets[0].scrollIntoView({
        block: rect.height > window.innerHeight * 0.6 ? 'start' : 'center',
        inline: 'nearest',
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
}

function isTypingTarget(element: EventTarget | null): boolean {
    return (
        element instanceof HTMLElement &&
        (element.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName))
    );
}

/**
 * Tutorial ao vivo sobre a própria tela: escurece a página, destaca o elemento do passo e mostra
 * um cartão com a explicação. Não é modal: a página continua utilizável e o foco não fica preso.
 */
export default function GuidedTour({ tour, onClose }: GuidedTourProps): React.JSX.Element {
    // Passos sem alvo na tela (por exemplo, "Carregar mais" sem mais registros) ficam de fora.
    const [steps] = useState<GuidedTourStep[]>(() => [
        ...tour.steps.filter(isTourStepAvailable),
        FINISH_STEP,
    ]);
    const [index, setIndex] = useState(0);
    const [layout, setLayout] = useState<TourLayout | null>(null);
    const [note, setNote] = useState<string | null>(null);
    const cardRef = useRef<HTMLElement | null>(null);
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    const openerRef = useRef<HTMLElement | null>(
        document.activeElement instanceof HTMLElement ? document.activeElement : null,
    );
    const titleId = useId();
    const contentId = useId();

    const step = steps[index];
    const isFirst = index === 0;
    const isLast = index === steps.length - 1;
    const paragraphs = Array.isArray(step.content) ? step.content : [step.content];
    const progress = `${Math.round(((index + 1) / steps.length) * 100)}%`;

    const close = useCallback(() => {
        onClose();
        openerRef.current?.focus({ preventScroll: true });
    }, [onClose]);

    const goTo = useCallback(
        (next: number) => setIndex(Math.min(Math.max(next, 0), steps.length - 1)),
        [steps.length],
    );

    // Entrada no passo: prepara a demonstração e mostra o alvo. O foco continua no botão usado
    // para avançar; vai ao título ao abrir ou quando esse botão some ou fica desabilitado.
    useEffect(() => {
        const result = step.onEnter?.(findTourTargets(step.target)[0] ?? null);
        const undo = typeof result === 'function' ? result : result?.undo;
        setNote(result && typeof result === 'object' ? (result.note ?? null) : null);
        const frame = requestAnimationFrame(() => {
            revealTargets(findTourTargets(step.target));
            const focused = document.activeElement;
            const keepsFocus =
                focused instanceof HTMLElement &&
                focused !== headingRef.current &&
                cardRef.current?.contains(focused) &&
                !focused.matches(':disabled');

            if (!keepsFocus) {
                headingRef.current?.focus({ preventScroll: true });
            }
        });

        return () => {
            cancelAnimationFrame(frame);

            undo?.();
        };
    }, [step]);

    // Acompanha o alvo a cada quadro: rolagem, mudança de tamanho e animações da página.
    useEffect(() => {
        let frame = 0;
        let previous = '';

        function measure(): void {
            const card = cardRef.current?.getBoundingClientRect();
            const next = computeTourLayout(
                enclosingRect(findTourTargets(step.target)),
                card ? { width: card.width, height: card.height } : FALLBACK_CARD_SIZE,
                { width: window.innerWidth, height: window.innerHeight },
                topBarOffset(),
            );
            const key = JSON.stringify(next);

            if (key !== previous) {
                previous = key;
                setLayout(next);
            }

            frame = requestAnimationFrame(measure);
        }

        measure();

        return () => cancelAnimationFrame(frame);
    }, [step]);

    // Esc fecha em qualquer lugar; as setas trocam de passo quando o foco está no cartão.
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent): void {
            if (event.key === 'Escape') {
                close();
                return;
            }

            const insideCard = cardRef.current?.contains(event.target as Node);

            if (!insideCard || isTypingTarget(event.target)) {
                return;
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                goTo(index + 1);
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                goTo(index - 1);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [close, goTo, index]);

    const spotlight = layout?.spotlight ?? null;
    const docked = layout?.card.docked ?? false;
    const cardStyle =
        layout && !docked ? { top: layout.card.top, left: layout.card.left } : undefined;
    const counter = `Passo ${index + 1} de ${steps.length}`;

    return createPortal(
        <div className="guidedTour" data-guided-tour="">
            {spotlight ? (
                <div className="guidedTour__spotlight" style={spotlight} aria-hidden="true" />
            ) : (
                <div className="guidedTour__backdrop" aria-hidden="true" />
            )}
            <section
                ref={cardRef}
                className={joinClassNames(
                    'guidedTour__card',
                    docked && 'guidedTour__card--docked',
                    !layout && 'guidedTour__card--measuring',
                )}
                style={cardStyle}
                role="dialog"
                aria-modal="false"
                aria-labelledby={titleId}
                aria-describedby={contentId}
            >
                <div className="guidedTour__header">
                    <p className="guidedTour__eyebrow">
                        <i className="icon-info" aria-hidden="true" />
                        Tutorial: {tour.title}
                    </p>
                    <button
                        type="button"
                        className="guidedTour__close"
                        onClick={close}
                        aria-label="Sair do tutorial"
                        title="Sair do tutorial"
                    >
                        <i className="fa fa-times" aria-hidden="true" />
                    </button>
                </div>
                <p className="guidedTour__announcement" aria-live="polite">
                    {`${counter}: ${step.title}. ${paragraphs.join(' ')} ${note ?? ''}`}
                </p>
                <p className="guidedTour__counter" aria-hidden="true">
                    {counter}
                    {step.group ? <span className="guidedTour__group">{step.group}</span> : null}
                </p>
                <div className="guidedTour__progress" aria-hidden="true">
                    <span style={{ width: progress }} />
                </div>
                <h2 ref={headingRef} id={titleId} className="guidedTour__title" tabIndex={-1}>
                    {step.title}
                </h2>
                <div id={contentId} className="guidedTour__content">
                    {paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                    {note ? (
                        <p className="guidedTour__note">
                            <i className="fa fa-magic" aria-hidden="true" />
                            {note}
                        </p>
                    ) : null}
                </div>
                {isLast && tour.helpHref ? (
                    <Link href={tour.helpHref} className="guidedTour__helpLink">
                        <i className="fa fa-book" aria-hidden="true" />
                        Ler mais sobre esta tela na Central de Ajuda
                    </Link>
                ) : null}
                <GuidedTourTrail steps={steps} currentIndex={index} onSelect={goTo} />
                <div className="guidedTour__actions">
                    <Button
                        type="button"
                        tone="white"
                        size="sm"
                        label="Voltar"
                        title="Voltar ao passo anterior"
                        leftIconClass="fa fa-arrow-left"
                        disabled={isFirst}
                        onClick={() => goTo(index - 1)}
                    />
                    {isLast ? (
                        <Button
                            type="button"
                            tone="save"
                            size="sm"
                            label="Concluir"
                            title="Concluir o tutorial"
                            onClick={close}
                        />
                    ) : (
                        <Button
                            type="button"
                            tone="primary"
                            size="sm"
                            label="Próximo"
                            title="Ir para o próximo passo"
                            rightIconClass="fa fa-arrow-right"
                            onClick={() => goTo(index + 1)}
                        />
                    )}
                </div>
            </section>
        </div>,
        document.body,
    );
}

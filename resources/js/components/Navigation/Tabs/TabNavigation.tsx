import { useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';

interface TabNavigationProps {
    activeKey: string;
    children: ReactNode;
    itemKeys: string[];
    className?: string;
    role?: 'tablist';
    animated?: boolean;
    dragToScroll?: boolean;
    /** Mantém o indicador animado ao distribuir as abas em várias linhas. */
    wrap?: boolean;
    /** Valor de `data-tour`, para o tutorial ao vivo destacar o componente. */
    tourTarget?: string;
}

/** Faixa compartilhada por abas locais e links entre páginas. */
export default function TabNavigation({
    activeKey,
    children,
    itemKeys,
    className = '',
    role,
    animated = true,
    dragToScroll = true,
    wrap = false,
    tourTarget,
}: TabNavigationProps): React.JSX.Element {
    const viewportRef = useRef<HTMLDivElement>(null);
    const navigationRef = useRef<HTMLUListElement>(null);
    const previousActiveKey = useRef(activeKey);
    const dragState = useRef({ pointerId: -1, startX: 0, scrollLeft: 0, moved: false });
    const suppressClick = useRef(false);
    const [isDragging, setIsDragging] = useState(false);
    const [indicator, setIndicator] = useState({ left: 0, right: 0, top: 0, ready: false });
    const [rowLines, setRowLines] = useState<number[]>([]);
    const [scrollCues, setScrollCues] = useState({ left: false, right: false });
    const itemSignature = JSON.stringify(itemKeys);

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        const navigation = navigationRef.current;
        if (!viewport || !navigation) return;

        function updateNavigation(): void {
            if (!viewport || !navigation) return;

            const tabElements = Array.from(
                navigation.querySelectorAll<HTMLElement>('[data-tab-key]'),
            );
            const navigationRect = navigation.getBoundingClientRect();
            const scaleY = wrap ? navigationRect.height / navigation.offsetHeight || 1 : 1;
            function rowLine(tab: HTMLElement): number {
                const rowRect = (tab.parentElement ?? tab).getBoundingClientRect();
                return (rowRect.bottom - navigationRect.top) / scaleY - 2;
            }

            if (wrap) {
                const lines = Array.from(new Set(tabElements.map(rowLine))).sort((a, b) => a - b);
                setRowLines((current) =>
                    current.length === lines.length && current.every((line, i) => line === lines[i])
                        ? current
                        : lines,
                );
            }

            const activeTab = tabElements.find((element) => element.dataset.tabKey === activeKey);

            if (activeTab) {
                const activeRect = activeTab.getBoundingClientRect();
                // As medidas CSS da grade precisam acompanhar o zoom de acessibilidade.
                const scaleX = wrap ? navigationRect.width / navigation.offsetWidth || 1 : 1;
                const left = (activeRect.left - navigationRect.left) / scaleX;

                const nextIndicator = {
                    left,
                    right: Math.max(
                        0,
                        navigationRect.width / scaleX - left - activeRect.width / scaleX,
                    ),
                    top: wrap ? rowLine(activeTab) : 0,
                    ready: true,
                };

                setIndicator((current) =>
                    current.left === nextIndicator.left &&
                    current.right === nextIndicator.right &&
                    current.top === nextIndicator.top &&
                    current.ready
                        ? current
                        : nextIndicator,
                );
            } else {
                setIndicator({ left: 0, right: 0, top: 0, ready: false });
            }

            const maximumScroll = viewport.scrollWidth - viewport.clientWidth;
            const nextCues = {
                left: viewport.scrollLeft > 1,
                right: maximumScroll > 1 && viewport.scrollLeft < maximumScroll - 1,
            };

            setScrollCues((current) =>
                current.left === nextCues.left && current.right === nextCues.right
                    ? current
                    : nextCues,
            );
        }

        updateNavigation();

        const activeTab = Array.from(
            navigation.querySelectorAll<HTMLElement>('[data-tab-key]'),
        ).find((element) => element.dataset.tabKey === activeKey);

        if (activeTab && !wrap) {
            const viewportRect = viewport.getBoundingClientRect();
            const activeRect = activeTab.getBoundingClientRect();
            const overflowLeft = activeRect.left - viewportRect.left;
            const overflowRight = activeRect.right - viewportRect.right;
            const distance = overflowLeft < 0 ? overflowLeft : Math.max(0, overflowRight);
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (distance !== 0) {
                viewport.scrollBy({
                    left: distance,
                    behavior:
                        previousActiveKey.current !== activeKey && !reduceMotion
                            ? 'smooth'
                            : 'auto',
                });
            }
        }

        previousActiveKey.current = activeKey;
        viewport.addEventListener('scroll', updateNavigation, { passive: true });
        const observer =
            typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateNavigation);
        observer?.observe(viewport);
        observer?.observe(navigation);
        navigation.querySelectorAll<HTMLElement>('[data-tab-key]').forEach((element) => {
            observer?.observe(element);
        });
        window.addEventListener('resize', updateNavigation);

        return () => {
            viewport.removeEventListener('scroll', updateNavigation);
            observer?.disconnect();
            window.removeEventListener('resize', updateNavigation);
        };
    }, [activeKey, itemSignature, wrap]);

    const canDrag = !wrap && dragToScroll && (scrollCues.left || scrollCues.right);

    function startDrag(event: PointerEvent<HTMLDivElement>): void {
        suppressClick.current = false;
        if (!canDrag || event.pointerType !== 'mouse' || event.button !== 0) return;

        dragState.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            scrollLeft: event.currentTarget.scrollLeft,
            moved: false,
        };
    }

    function finishDrag(event: PointerEvent<HTMLDivElement>): void {
        const drag = dragState.current;
        if (drag.pointerId !== event.pointerId) return;

        suppressClick.current = drag.moved;
        drag.pointerId = -1;
        setIsDragging(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    function moveDrag(event: PointerEvent<HTMLDivElement>): void {
        const drag = dragState.current;
        if (drag.pointerId !== event.pointerId) return;
        if ((event.buttons & 1) === 0) {
            finishDrag(event);
            return;
        }

        const distance = event.clientX - drag.startX;
        if (!drag.moved && Math.abs(distance) < 5) return;

        if (!drag.moved) {
            drag.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsDragging(true);
        }

        event.preventDefault();
        event.currentTarget.scrollLeft = drag.scrollLeft - distance;
    }

    function scrollNavigation(direction: -1 | 1): void {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        viewport.scrollBy({
            left: direction * Math.max(viewport.clientWidth * 0.7, 160),
            behavior: reduceMotion ? 'auto' : 'smooth',
        });
    }

    const viewportClassName = [
        'tabs__navViewport',
        wrap ? 'tabs__navViewport--wrap' : '',
        canDrag ? 'tabs__navViewport--draggable' : '',
        isDragging ? 'tabs__navViewport--dragging' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="tabs__navScroller" data-tour={tourTarget}>
            {!wrap && dragToScroll && scrollCues.left ? (
                <button
                    type="button"
                    className="tabs__scrollCue tabs__scrollCue--left"
                    aria-label="Mostrar abas anteriores"
                    title="Mostrar abas anteriores"
                    onClick={() => scrollNavigation(-1)}
                >
                    <span aria-hidden="true">‹</span>
                </button>
            ) : null}
            <div
                ref={viewportRef}
                className={viewportClassName}
                onPointerDown={startDrag}
                onPointerMove={moveDrag}
                onPointerUp={finishDrag}
                onPointerCancel={finishDrag}
                onLostPointerCapture={finishDrag}
                onDragStart={(event) => event.preventDefault()}
                onClickCapture={(event) => {
                    if (suppressClick.current && event.detail !== 0) {
                        event.preventDefault();
                        event.stopPropagation();
                        suppressClick.current = false;
                    }
                }}
            >
                <ul
                    ref={navigationRef}
                    className={`${className} ${animated ? 'tabs__nav--animated' : ''} ${wrap ? 'tabs__nav--wrap' : ''}`}
                    role={role}
                    aria-orientation={role === 'tablist' ? 'horizontal' : undefined}
                >
                    {wrap
                        ? rowLines.map((top) => (
                              <li
                                  key={top}
                                  className="tabs__rowLine"
                                  style={{ top: `${top}px` }}
                                  role="presentation"
                                  aria-hidden="true"
                              />
                          ))
                        : null}
                    {children}
                    {animated ? (
                        <li
                            className={
                                indicator.ready
                                    ? 'tabs__indicator tabs__indicator--ready'
                                    : 'tabs__indicator'
                            }
                            style={{
                                left: `${indicator.left}px`,
                                right: `${indicator.right}px`,
                                top: wrap ? `${indicator.top}px` : undefined,
                                bottom: wrap ? 'auto' : undefined,
                            }}
                            role="presentation"
                            aria-hidden="true"
                        />
                    ) : null}
                </ul>
            </div>
            {!wrap && dragToScroll && scrollCues.right ? (
                <button
                    type="button"
                    className="tabs__scrollCue tabs__scrollCue--right"
                    aria-label="Mostrar próximas abas"
                    title="Mostrar próximas abas"
                    onClick={() => scrollNavigation(1)}
                >
                    <span aria-hidden="true">›</span>
                </button>
            ) : null}
        </div>
    );
}

import {
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
    type KeyboardEvent,
    type PointerEvent,
    type ReactNode,
} from 'react';
import './Tabs.css';

export interface TabItem {
    id: string;
    label: ReactNode;
    accessibleLabel?: string;
    icon?: string;
    content: ReactNode;
}

interface TabsProps {
    items: TabItem[];
    initialActiveId?: string;
    variant?:
        | 'standard'
        | 'material'
        | 'bootstrap'
        | 'justified'
        | 'vertical'
        | 'vertical-reverse'
        | 'pills';
    /** Informa a aba escolhida pelo usuário; combine com initialActiveId para controlar a aba ativa. */
    onChange?: (id: string) => void;
    /** Permite arrastar horizontalmente a faixa de abas e mostra controles nas bordas. */
    dragToScroll?: boolean;
}

export default function Tabs({
    items,
    initialActiveId,
    variant = 'standard',
    onChange,
    dragToScroll = false,
}: TabsProps): React.JSX.Element {
    const [activeId, setActiveId] = useState<string>(initialActiveId ?? items[0]?.id ?? '');
    const activeItem = items.find((item: TabItem) => item.id === activeId) ?? items[0];
    const isVertical = variant === 'vertical' || variant === 'vertical-reverse';
    const hasMobileIcons = items.some((item: TabItem) => item.icon);
    const tabsId = useId();
    const previousInitialActiveId = useRef(initialActiveId);
    const previousMeasuredActiveId = useRef(activeId);
    const navigationRef = useRef<HTMLUListElement>(null);
    const navigationViewportRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef(new Map<string, HTMLButtonElement>());
    const dragState = useRef({ pointerId: -1, startX: 0, scrollLeft: 0, moved: false });
    const lastDragEnd = useRef(0);
    const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });
    const [isDragging, setIsDragging] = useState(false);
    const [scrollCues, setScrollCues] = useState({ left: false, right: false });

    useEffect(() => {
        const initialActiveIdChanged = previousInitialActiveId.current !== initialActiveId;
        previousInitialActiveId.current = initialActiveId;

        if (
            initialActiveIdChanged &&
            initialActiveId &&
            initialActiveId !== activeId &&
            items.some((item) => item.id === initialActiveId)
        ) {
            setActiveId(initialActiveId);
            return;
        }

        if (items.length && !items.some((item) => item.id === activeId)) {
            setActiveId(items[0].id);
        }
    }, [activeId, initialActiveId, items]);

    useLayoutEffect(() => {
        if (isVertical || (variant !== 'standard' && variant !== 'material')) return;

        const navigation = navigationRef.current;
        const activeTab = tabRefs.current.get(activeId);
        if (!navigation || !activeTab) return;

        function updateIndicator(): void {
            const navigationRect = navigation.getBoundingClientRect();
            const activeTabRect = activeTab.getBoundingClientRect();

            setIndicator({
                left: activeTabRect.left - navigationRect.left + navigation.scrollLeft,
                width: activeTabRect.width,
                ready: true,
            });
        }

        updateIndicator();

        const activeTabChanged = previousMeasuredActiveId.current !== activeId;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        activeTab.scrollIntoView({
            behavior: activeTabChanged && !reduceMotion ? 'smooth' : 'auto',
            block: 'nearest',
            inline: 'nearest',
        });
        previousMeasuredActiveId.current = activeId;

        const observer =
            typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateIndicator);
        observer?.observe(navigation);
        observer?.observe(activeTab);
        window.addEventListener('resize', updateIndicator);

        return () => {
            observer?.disconnect();
            window.removeEventListener('resize', updateIndicator);
        };
    }, [activeId, isVertical, items.length, variant]);

    useLayoutEffect(() => {
        if (isVertical || !dragToScroll) {
            setScrollCues({ left: false, right: false });
            return;
        }

        const viewport = navigationViewportRef.current;
        const navigation = navigationRef.current;
        if (!viewport || !navigation) return;

        function updateScrollCues(): void {
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

        updateScrollCues();
        viewport.addEventListener('scroll', updateScrollCues, { passive: true });
        const observer =
            typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateScrollCues);
        observer?.observe(viewport);
        observer?.observe(navigation);
        window.addEventListener('resize', updateScrollCues);

        return () => {
            viewport.removeEventListener('scroll', updateScrollCues);
            observer?.disconnect();
            window.removeEventListener('resize', updateScrollCues);
        };
    }, [dragToScroll, isVertical, items.length]);

    function selectTab(id: string): void {
        setActiveId(id);
        onChange?.(id);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number): void {
        const previousKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
        const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
        let nextIndex: number | undefined;

        if (event.key === previousKey) {
            nextIndex = (currentIndex - 1 + items.length) % items.length;
        } else if (event.key === nextKey) {
            nextIndex = (currentIndex + 1) % items.length;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = items.length - 1;
        }

        if (nextIndex === undefined) return;

        event.preventDefault();
        selectTab(items[nextIndex].id);
        const nextTab = event.currentTarget
            .closest('[role="tablist"]')
            ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
            .item(nextIndex);
        nextTab?.focus();
    }

    function handleDragStart(event: PointerEvent<HTMLDivElement>): void {
        if (!dragToScroll || event.pointerType !== 'mouse' || event.button !== 0) return;

        dragState.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            scrollLeft: event.currentTarget.scrollLeft,
            moved: false,
        };
    }

    function handleDragMove(event: PointerEvent<HTMLDivElement>): void {
        const drag = dragState.current;
        if (drag.pointerId !== event.pointerId) return;
        if ((event.buttons & 1) === 0) {
            dragState.current.pointerId = -1;
            setIsDragging(false);
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

    function finishDrag(event: PointerEvent<HTMLDivElement>): void {
        const drag = dragState.current;
        if (drag.pointerId !== event.pointerId) return;

        if (drag.moved) lastDragEnd.current = Date.now();
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        dragState.current.pointerId = -1;
        setIsDragging(false);
    }

    function scrollNavigation(direction: -1 | 1): void {
        const viewport = navigationViewportRef.current;
        if (!viewport) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        viewport.scrollBy({
            left: direction * Math.max(viewport.clientWidth * 0.7, 160),
            behavior: reduceMotion ? 'auto' : 'smooth',
        });
    }

    const navigationViewportClassName = [
        'tabs__navViewport',
        dragToScroll ? 'tabs__navViewport--draggable' : '',
        isDragging ? 'tabs__navViewport--dragging' : '',
    ]
        .filter(Boolean)
        .join(' ');
    const navigationList = (
        <ul
            ref={navigationRef}
            className={`tabs__nav ${isVertical ? 'tabs__nav--vertical' : ''} ${variant === 'material' ? 'tabs__nav--material' : ''} ${variant === 'bootstrap' ? 'tabs__nav--bootstrap' : ''} ${variant === 'justified' ? 'tabs__nav--justified' : ''} ${variant === 'pills' ? 'tabs__nav--pills' : ''} ${variant === 'standard' || variant === 'material' ? 'tabs__nav--animated' : ''} ${hasMobileIcons ? 'tabs__nav--mobileIcons' : ''}`}
            role="tablist"
            aria-orientation={isVertical ? 'vertical' : 'horizontal'}
        >
            {items.map((item: TabItem, index) => (
                <li
                    key={item.id}
                    className={activeId === item.id ? 'tabs__item--active' : ''}
                    role="presentation"
                >
                    <button
                        ref={(element) => {
                            if (element) tabRefs.current.set(item.id, element);
                            else tabRefs.current.delete(item.id);
                        }}
                        type="button"
                        className="tabs__button"
                        role="tab"
                        id={`${tabsId}-${item.id}-tab`}
                        aria-label={item.accessibleLabel}
                        aria-selected={activeId === item.id}
                        aria-controls={`${tabsId}-${item.id}-panel`}
                        tabIndex={activeId === item.id ? 0 : -1}
                        onClick={() => selectTab(item.id)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                    >
                        <span className="tabs__label">{item.label}</span>
                        {item.icon ? (
                            <i className={`tabs__icon ${item.icon}`} aria-hidden="true" />
                        ) : null}
                    </button>
                </li>
            ))}
            {variant === 'standard' || variant === 'material' ? (
                <li
                    className={
                        indicator.ready
                            ? 'tabs__indicator tabs__indicator--ready'
                            : 'tabs__indicator'
                    }
                    style={{
                        width: `${indicator.width}px`,
                        transform: `translateX(${indicator.left}px)`,
                    }}
                    role="presentation"
                    aria-hidden="true"
                />
            ) : null}
        </ul>
    );
    const navigation = isVertical ? (
        navigationList
    ) : (
        <div className="tabs__navScroller">
            {dragToScroll && scrollCues.left ? (
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
                ref={navigationViewportRef}
                className={navigationViewportClassName}
                onPointerDown={handleDragStart}
                onPointerMove={handleDragMove}
                onPointerUp={finishDrag}
                onPointerCancel={finishDrag}
                onClickCapture={(event) => {
                    if (Date.now() - lastDragEnd.current < 100) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }}
            >
                {navigationList}
            </div>
            {dragToScroll && scrollCues.right ? (
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

    if (isVertical) {
        return (
            <div className="tabs__verticalEnv">
                {variant === 'vertical' ? navigation : null}
                <div
                    key={activeItem?.id}
                    id={`${tabsId}-${activeItem?.id}-panel`}
                    className="tabs__content tabs__content--vertical"
                    role="tabpanel"
                    aria-labelledby={`${tabsId}-${activeItem?.id}-tab`}
                    tabIndex={0}
                >
                    {activeItem?.content}
                </div>
                {variant === 'vertical-reverse' ? navigation : null}
            </div>
        );
    }

    return (
        <div className={`tabs tabs--${variant}`}>
            {navigation}
            <div
                key={activeItem?.id}
                id={`${tabsId}-${activeItem?.id}-panel`}
                className="tabs__content"
                role="tabpanel"
                aria-labelledby={`${tabsId}-${activeItem?.id}-tab`}
                tabIndex={0}
            >
                {activeItem?.content}
            </div>
        </div>
    );
}

export interface AccordionItem {
    id: string;
    title: string;
    content: ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
    initialActiveId?: string;
    joined?: boolean;
}

export function Accordion({
    items,
    initialActiveId,
    joined = false,
}: AccordionProps): React.JSX.Element {
    const [activeId, setActiveId] = useState<string | null>(initialActiveId ?? null);

    return (
        <div className={`tabs__accordion ${joined ? 'tabs__accordion--joined' : ''}`}>
            {items.map((item: AccordionItem) => {
                const isOpen = activeId === item.id;
                return (
                    <div
                        className={`tabs__accordionItem ${isOpen ? 'tabs__accordionItem--open' : ''}`}
                        key={item.id}
                    >
                        <h4 className="tabs__accordionHeading">
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                onClick={() => setActiveId(isOpen ? null : item.id)}
                            >
                                {item.title}
                            </button>
                        </h4>
                        <div
                            className={`tabs__accordionBody ${isOpen ? 'tabs__accordionBody--open' : ''}`}
                            aria-hidden={!isOpen}
                        >
                            <div className="tabs__accordionBodyInner">{item.content}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

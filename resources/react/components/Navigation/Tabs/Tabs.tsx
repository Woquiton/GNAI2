import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import TabNavigation from './TabNavigation';
import './Tabs.css';

export interface TabItem {
    id: string;
    label: ReactNode;
    accessibleLabel?: string;
    icon?: string;
    content: ReactNode;
    /** Valor de `data-tour` do botão da aba, para o tutorial ao vivo saber se ela existe. */
    tourTarget?: string;
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
    /** Valor de `data-tour` da faixa de abas, para o tutorial ao vivo destacá-la. */
    tourTarget?: string;
}

export default function Tabs({
    items,
    initialActiveId,
    variant = 'standard',
    onChange,
    dragToScroll = true,
    tourTarget,
}: TabsProps): React.JSX.Element {
    const [activeId, setActiveId] = useState<string>(initialActiveId ?? items[0]?.id ?? '');
    const activeItem = items.find((item: TabItem) => item.id === activeId) ?? items[0];
    const isVertical = variant === 'vertical' || variant === 'vertical-reverse';
    const hasMobileIcons = items.some((item: TabItem) => item.icon);
    const tabsId = useId();
    const previousInitialActiveId = useRef(initialActiveId);

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

        if (nextIndex === undefined) {
            return;
        }

        event.preventDefault();
        selectTab(items[nextIndex].id);
        const nextTab = event.currentTarget
            .closest('[role="tablist"]')
            ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
            .item(nextIndex);
        nextTab?.focus();
    }

    const navigationClassName = [
        'tabs__nav',
        isVertical ? 'tabs__nav--vertical' : '',
        variant !== 'standard' ? `tabs__nav--${variant}` : '',
        hasMobileIcons ? 'tabs__nav--mobileIcons' : '',
    ]
        .filter(Boolean)
        .join(' ');
    const navigationItems = items.map((item: TabItem, index) => (
        <li
            key={item.id}
            className={activeId === item.id ? 'tabs__item--active' : ''}
            role="presentation"
        >
            <button
                data-tab-key={item.id}
                data-tour={item.tourTarget}
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
                {item.icon ? <i className={`tabs__icon ${item.icon}`} aria-hidden="true" /> : null}
            </button>
        </li>
    ));
    const navigation = isVertical ? (
        <ul
            className={navigationClassName}
            role="tablist"
            aria-orientation="vertical"
            data-tour={tourTarget}
        >
            {navigationItems}
        </ul>
    ) : (
        <TabNavigation
            activeKey={activeItem?.id ?? ''}
            itemKeys={items.map((item) => item.id)}
            className={navigationClassName}
            role="tablist"
            animated={variant === 'standard' || variant === 'material'}
            dragToScroll={dragToScroll}
            tourTarget={tourTarget}
        >
            {navigationItems}
        </TabNavigation>
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
    headingLevel?: 2 | 3 | 4;
}

export function Accordion({
    items,
    initialActiveId,
    joined = false,
    headingLevel = 4,
}: AccordionProps): React.JSX.Element {
    const [activeId, setActiveId] = useState<string | null>(initialActiveId ?? null);
    const instanceId = useId();
    const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';

    return (
        <div className={`tabs__accordion ${joined ? 'tabs__accordion--joined' : ''}`}>
            {items.map((item: AccordionItem, index) => {
                const isOpen = activeId === item.id;
                const triggerId = `${instanceId}-trigger-${index}`;
                const panelId = `${instanceId}-panel-${index}`;
                return (
                    <div
                        className={`tabs__accordionItem ${isOpen ? 'tabs__accordionItem--open' : ''}`}
                        key={item.id}
                    >
                        <Heading className="tabs__accordionHeading">
                            <button
                                type="button"
                                id={triggerId}
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setActiveId(isOpen ? null : item.id)}
                            >
                                {item.title}
                            </button>
                        </Heading>
                        <div
                            id={panelId}
                            role="region"
                            aria-labelledby={triggerId}
                            className={`tabs__accordionBody ${isOpen ? 'tabs__accordionBody--open' : ''}`}
                            aria-hidden={!isOpen}
                            inert={!isOpen}
                        >
                            <div className="tabs__accordionBodyInner">{item.content}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

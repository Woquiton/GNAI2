import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
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
  variant?: 'standard' | 'material' | 'bootstrap' | 'justified' | 'vertical' | 'vertical-reverse' | 'pills';
  /** Informa a aba escolhida pelo usuário; combine com initialActiveId para controlar a aba ativa. */
  onChange?: (id: string) => void;
}

export default function Tabs({ items, initialActiveId, variant = 'standard', onChange }: TabsProps): React.JSX.Element {
  const [activeId, setActiveId] = useState<string>(initialActiveId ?? items[0]?.id ?? '');
  const activeItem = items.find((item: TabItem) => item.id === activeId) ?? items[0];
  const isVertical = variant === 'vertical' || variant === 'vertical-reverse';
  const hasMobileIcons = items.some((item: TabItem) => item.icon);
  const tabsId = useId();
  const previousInitialActiveId = useRef(initialActiveId);
  const previousMeasuredActiveId = useRef(activeId);
  const navigationRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  useEffect(() => {
    const initialActiveIdChanged = previousInitialActiveId.current
      !== initialActiveId;
    previousInitialActiveId.current = initialActiveId;

    if (
      initialActiveIdChanged
      && initialActiveId
      && initialActiveId !== activeId
      && items.some((item) => item.id === initialActiveId)
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

    const observer = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updateIndicator);
    observer?.observe(navigation);
    observer?.observe(activeTab);
    window.addEventListener('resize', updateIndicator);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeId, isVertical, items.length, variant]);

  function selectTab(id: string): void {
    setActiveId(id);
    onChange?.(id);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ): void {
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

  const navigationList = (
    <ul
      ref={navigationRef}
      className={`tabs__nav ${isVertical ? 'tabs__nav--vertical' : ''} ${variant === 'material' ? 'tabs__nav--material' : ''} ${variant === 'bootstrap' ? 'tabs__nav--bootstrap' : ''} ${variant === 'justified' ? 'tabs__nav--justified' : ''} ${variant === 'pills' ? 'tabs__nav--pills' : ''} ${variant === 'standard' || variant === 'material' ? 'tabs__nav--animated' : ''} ${hasMobileIcons ? 'tabs__nav--mobileIcons' : ''}`}
      role="tablist"
      aria-orientation={isVertical ? 'vertical' : 'horizontal'}
    >
      {items.map((item: TabItem, index) => (
        <li key={item.id} className={activeId === item.id ? 'tabs__item--active' : ''} role="presentation">
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
            {item.icon ? <i className={`tabs__icon ${item.icon}`} aria-hidden="true" /> : null}
          </button>
        </li>
      ))}
      {variant === 'standard' || variant === 'material' ? (
        <li
          className={indicator.ready
            ? 'tabs__indicator tabs__indicator--ready'
            : 'tabs__indicator'}
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
  const navigation = isVertical ? navigationList : (
    <div className="tabs__navViewport">
      {navigationList}
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

export function Accordion({ items, initialActiveId, joined = false }: AccordionProps): React.JSX.Element {
  const [activeId, setActiveId] = useState<string | null>(initialActiveId ?? null);

  return (
    <div className={`tabs__accordion ${joined ? 'tabs__accordion--joined' : ''}`}>
      {items.map((item: AccordionItem) => {
        const isOpen = activeId === item.id;
        return (
          <div className={`tabs__accordionItem ${isOpen ? 'tabs__accordionItem--open' : ''}`} key={item.id}>
            <h4 className="tabs__accordionHeading">
              <button type="button" aria-expanded={isOpen} onClick={() => setActiveId(isOpen ? null : item.id)}>
                {item.title}
              </button>
            </h4>
            <div className={`tabs__accordionBody ${isOpen ? 'tabs__accordionBody--open' : ''}`} aria-hidden={!isOpen}>
              <div className="tabs__accordionBodyInner">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

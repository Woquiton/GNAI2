import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import '@styles/components/Navigation/SidebarPrimary/SidebarPrimary.css';
import '@styles/components/Navigation/SidebarPrimary/SidebarPrimary.small.css';
import SidebarUser from '@/components/Navigation/SidebarUser/SidebarUser';
import type { SidebarUserDetails } from '@/components/Navigation/SidebarUser/SidebarUser.types';
import { isKeyboardFocusMode } from '@/utils/accessibilityPreferences';
import type { SidebarEntry, SidebarItem } from './SidebarPrimary.types';
import { useSidebarBranches } from './useSidebarBranches';
import { hasActiveDescendant, isSectionTitle } from './SidebarPrimary.helpers';
import SidebarMenu from './SidebarMenu';
import SidebarCollapsedFlyout from './SidebarCollapsedFlyout';
import SidebarScrollbar from './SidebarScrollbar';

interface SidebarPrimaryProps {
    collapsed: boolean;
    entries?: SidebarEntry[];
    currentItemKey?: string;
    smallMenu?: boolean;
    user?: SidebarUserDetails;
}

export default function SidebarPrimary({
    collapsed,
    currentItemKey,
    smallMenu = false,
    user,
    entries = [],
}: SidebarPrimaryProps): React.JSX.Element {
    const { openKeyList, toggleItem } = useSidebarBranches(entries, currentItemKey);
    const [scrollbarVisible, setScrollbarVisible] = useState<boolean>(false);
    const [thumbHeight, setThumbHeight] = useState<number>(0);
    const [thumbTop, setThumbTop] = useState<number>(0);
    const [hoveredCollapsedItem, setHoveredCollapsedItem] = useState<SidebarItem | null>(null);
    const [hoveredCollapsedItemTop, setHoveredCollapsedItemTop] = useState<number>(0);
    const [collapsedFlyoutTop, setCollapsedFlyoutTop] = useState<number>(0);
    const [collapsedFlyoutAbove, setCollapsedFlyoutAbove] = useState<boolean>(false);
    const [hoveredCollapsedItemHeight, setHoveredCollapsedItemHeight] = useState<number>(0);
    const [hoveredCollapsedFlyoutWidth, setHoveredCollapsedFlyoutWidth] = useState<number>(190);
    const sidebarRef = useRef<HTMLElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);
    const collapsedFlyoutRef = useRef<HTMLDivElement | null>(null);
    const hideTimerRef = useRef<number | null>(null);
    const collapsedHoverHideTimerRef = useRef<number | null>(null);
    /** Item recolhido que abriu o flyout; recebe o foco de volta ao sair dele pelo teclado. */
    const collapsedTriggerRef = useRef<HTMLAnchorElement | null>(null);
    /** Evita que o foco devolvido pelo Esc reabra o flyout que acabou de ser fechado. */
    const suppressFocusOpenRef = useRef<boolean>(false);

    useEffect(() => {
        if (!collapsed) {
            if (collapsedHoverHideTimerRef.current !== null) {
                window.clearTimeout(collapsedHoverHideTimerRef.current);
                collapsedHoverHideTimerRef.current = null;
            }

            setHoveredCollapsedItem(null);
        }
    }, [collapsed]);

    useEffect(() => {
        if (!collapsed || !hoveredCollapsedItem || !collapsedFlyoutRef.current) {
            return;
        }

        const element = collapsedFlyoutRef.current;

        function updateWidth(): void {
            // Largura exata (sem arredondar): a linha projetada não pode passar da borda do flyout.
            const nextWidth = Math.max(190, element.getBoundingClientRect().width);
            setHoveredCollapsedFlyoutWidth(nextWidth);
            const availableHeight = sidebarRef.current?.clientHeight ?? window.innerHeight;
            const height = Math.round(element.getBoundingClientRect().height);
            const rowTop = hoveredCollapsedItemTop - hoveredCollapsedItemHeight;
            const above = hoveredCollapsedItemTop + height > availableHeight;
            setCollapsedFlyoutAbove(above);
            // Acima da linha, o flyout a sobrepõe em 1 px (como abaixo), sem fresta entre os dois.
            setCollapsedFlyoutTop(
                above ? Math.max(0, rowTop - height + 1) : hoveredCollapsedItemTop,
            );
        }

        updateWidth();

        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        const observer = new ResizeObserver(() => {
            updateWidth();
        });

        observer.observe(element);
        window.addEventListener('resize', updateWidth);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateWidth);
        };
    }, [collapsed, hoveredCollapsedItem, hoveredCollapsedItemTop, hoveredCollapsedItemHeight]);

    useEffect(() => {
        const element = innerRef.current;

        if (!element) {
            return;
        }

        function clearHideTimer(): void {
            if (hideTimerRef.current !== null) {
                window.clearTimeout(hideTimerRef.current);
                hideTimerRef.current = null;
            }
        }

        function queueHide(): void {
            clearHideTimer();
            hideTimerRef.current = window.setTimeout(() => {
                setScrollbarVisible(false);
            }, 1000);
        }

        const updateThumb = (): void => {
            const visibleHeight = element.clientHeight;
            const scrollHeight = element.scrollHeight;

            if (scrollHeight <= visibleHeight) {
                setThumbHeight(0);
                setThumbTop(0);
                setScrollbarVisible(false);
                return;
            }

            const nextThumbHeight = Math.max((visibleHeight / scrollHeight) * visibleHeight, 30);
            const maxThumbTop = visibleHeight - nextThumbHeight;
            const scrollRatio = element.scrollTop / (scrollHeight - visibleHeight);
            const nextThumbTop = maxThumbTop * scrollRatio;

            setThumbHeight(nextThumbHeight);
            setThumbTop(nextThumbTop);
        };

        function handleScroll(): void {
            updateThumb();
            setScrollbarVisible(true);
            queueHide();
        }

        const handleMouseEnter = (): void => {
            updateThumb();
            if (thumbHeight > 0 || element.scrollHeight > element.clientHeight) {
                setScrollbarVisible(true);
            }
            queueHide();
        };

        function handleMouseLeave(): void {
            queueHide();
        }

        updateThumb();
        element.addEventListener('scroll', handleScroll, { passive: true });
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', updateThumb);

        return () => {
            clearHideTimer();
            element.removeEventListener('scroll', handleScroll);
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', updateThumb);
        };
    }, [thumbHeight]);

    function handleItemClick(event: React.MouseEvent<HTMLAnchorElement>, item: SidebarItem): void {
        // Enter/Espaço geram clique com `detail` 0: o foco do teclado precisa continuar no item.
        const fromKeyboard = event.detail === 0;

        if (!fromKeyboard) {
            event.currentTarget.blur();
        }

        if (item.children?.length) {
            event.preventDefault();

            if (!collapsed) {
                toggleItem(item);
            } else if (fromKeyboard && event.currentTarget.parentElement instanceof HTMLLIElement) {
                showCollapsedItem(item, event.currentTarget.parentElement);
                focusFirstFlyoutLink();
            }

            return;
        }

        if (!item.href || item.href === '#' || item.href.startsWith('javascript:')) {
            event.preventDefault();
            if (!collapsed) toggleItem(item);
            return;
        }

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        event.preventDefault();

        const targetUrl = new URL(event.currentTarget.href);

        if (targetUrl.origin !== window.location.origin) {
            window.location.href = targetUrl.href;
            return;
        }

        const nextPath = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
        const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

        if (nextPath === currentPath) {
            return;
        }

        router.visit(nextPath);
    }

    function clearCollapsedHoverHideTimer(): void {
        if (collapsedHoverHideTimerRef.current !== null) {
            window.clearTimeout(collapsedHoverHideTimerRef.current);
            collapsedHoverHideTimerRef.current = null;
        }
    }

    function showCollapsedItem(item: SidebarItem, element: HTMLLIElement): void {
        if (!collapsed || suppressFocusOpenRef.current) {
            return;
        }

        clearCollapsedHoverHideTimer();

        collapsedTriggerRef.current = element.querySelector<HTMLAnchorElement>(':scope > a');
        const sidebarElement = sidebarRef.current;

        if (!sidebarElement) {
            setHoveredCollapsedItem(item);
            setHoveredCollapsedItemTop(0);
            return;
        }

        const itemRect = element.getBoundingClientRect();
        const sidebarRect = sidebarElement.getBoundingClientRect();

        // Posições inteiras: frações de pixel deixavam uma fresta entre a linha e o flyout.
        const itemBottom = Math.round(itemRect.bottom - sidebarRect.top);
        const itemHeight = Math.round(itemRect.height);

        setHoveredCollapsedItem(item);
        setHoveredCollapsedItemTop(itemBottom);
        setCollapsedFlyoutTop(itemBottom);
        setCollapsedFlyoutAbove(false);
        setHoveredCollapsedItemHeight(itemHeight);
    }

    function queueCollapsedHoverHide(): void {
        clearCollapsedHoverHideTimer();
        collapsedHoverHideTimerRef.current = window.setTimeout(() => {
            setHoveredCollapsedItem(null);
        }, 120);
    }

    function flyoutLinks(): HTMLAnchorElement[] {
        return Array.from(
            sidebarRef.current?.querySelectorAll<HTMLAnchorElement>(
                '.sidebarPrimary__collapsedFlyout a[href]',
            ) ?? [],
        );
    }

    /** Move o foco para o primeiro link do flyout depois que ele é renderizado. */
    function focusFirstFlyoutLink(): void {
        window.requestAnimationFrame(() => flyoutLinks()[0]?.focus());
    }

    function handleCollapsedTriggerKeyDown(
        event: React.KeyboardEvent<HTMLAnchorElement>,
        item: SidebarItem,
    ): void {
        if (!collapsed || !item.children?.length || event.key !== 'ArrowRight') {
            return;
        }

        event.preventDefault();

        if (event.currentTarget.parentElement instanceof HTMLLIElement) {
            showCollapsedItem(item, event.currentTarget.parentElement);
            focusFirstFlyoutLink();
        }
    }

    /**
     * Teclado no flyout do menu recolhido: Esc ou seta à esquerda voltam ao item; Tab no último
     * link segue para o próximo item do menu e Shift+Tab no primeiro volta ao item de origem.
     */
    function handleFlyoutKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
        const trigger = collapsedTriggerRef.current;

        if (!trigger) {
            return;
        }

        if (event.key === 'Escape' || event.key === 'ArrowLeft') {
            event.preventDefault();
            event.stopPropagation();
            clearCollapsedHoverHideTimer();
            setHoveredCollapsedItem(null);
            suppressFocusOpenRef.current = true;
            trigger.focus();
            suppressFocusOpenRef.current = false;
            return;
        }

        if (event.key !== 'Tab') {
            return;
        }

        const links = flyoutLinks();
        const active = document.activeElement;

        if (event.shiftKey && active === links[0]) {
            event.preventDefault();
            trigger.focus();
            return;
        }

        if (!event.shiftKey && active === links[links.length - 1]) {
            const topLevelLinks = Array.from(
                sidebarRef.current?.querySelectorAll<HTMLAnchorElement>(
                    '.sidebarPrimary__menu > ul > li > a',
                ) ?? [],
            );
            const next = topLevelLinks[topLevelLinks.indexOf(trigger) + 1];

            if (next) {
                event.preventDefault();
                next.focus();
            }
        }
    }

    function handleFlyoutBlur(event: React.FocusEvent<HTMLDivElement>): void {
        const next = event.relatedTarget;

        if (!isKeyboardFocusMode()) {
            return;
        }

        if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
            queueCollapsedHoverHide();
        }
    }

    return (
        <aside
            ref={sidebarRef}
            className={`sidebarPrimary left side-menu ${collapsed ? 'sidebarPrimary--collapsed' : ''} ${smallMenu ? 'sidebarPrimary--small' : ''}`}
            aria-label="Menu lateral principal"
        >
            <div ref={innerRef} className="sidebarPrimary__inner sidebar-inner">
                {user && !collapsed ? <SidebarUser user={user} /> : null}
                <nav id="sidebar-menu" className="sidebarPrimary__menu" aria-label="Menu principal">
                    <SidebarMenu
                        entries={entries}
                        collapsed={collapsed}
                        openKeyList={openKeyList}
                        activeCollapsedFlyoutKey={
                            hoveredCollapsedItem?.children?.length
                                ? hoveredCollapsedItem.key
                                : undefined
                        }
                        onItemClick={handleItemClick}
                        onItemKeyDown={handleCollapsedTriggerKeyDown}
                        onTopLevelHoverStart={showCollapsedItem}
                        onTopLevelHoverEnd={queueCollapsedHoverHide}
                        isSectionTitle={isSectionTitle}
                        hasActiveDescendant={(item: SidebarItem) =>
                            hasActiveDescendant(item, currentItemKey)
                        }
                    />
                    <div className="clearfix" />
                </nav>
                <div className="clearfix" />
            </div>
            {collapsed && hoveredCollapsedItem ? (
                hoveredCollapsedItem.children?.length ? (
                    <div
                        className="sidebarPrimary__collapsedProjection"
                        style={{
                            top: `${hoveredCollapsedItemTop - hoveredCollapsedItemHeight}px`,
                            height: `${hoveredCollapsedItemHeight}px`,
                            width: `${hoveredCollapsedFlyoutWidth}px`,
                        }}
                        aria-hidden="true"
                        onMouseEnter={clearCollapsedHoverHideTimer}
                        onMouseLeave={queueCollapsedHoverHide}
                    >
                        <span>{hoveredCollapsedItem.label}</span>
                    </div>
                ) : (
                    <div
                        className="sidebarPrimary__collapsedTooltip"
                        style={{
                            top: `${hoveredCollapsedItemTop - hoveredCollapsedItemHeight / 2}px`,
                        }}
                        aria-hidden="true"
                    >
                        {hoveredCollapsedItem.label}
                    </div>
                )
            ) : null}
            {collapsed && hoveredCollapsedItem?.children?.length ? (
                <SidebarCollapsedFlyout
                    item={hoveredCollapsedItem}
                    currentItemKey={currentItemKey}
                    top={collapsedFlyoutTop}
                    above={collapsedFlyoutAbove}
                    openKeyList={openKeyList}
                    bodyRef={collapsedFlyoutRef}
                    onItemClick={handleItemClick}
                    onMouseEnter={clearCollapsedHoverHideTimer}
                    onMouseLeave={queueCollapsedHoverHide}
                    onFocus={clearCollapsedHoverHideTimer}
                    onBlur={handleFlyoutBlur}
                    onKeyDown={handleFlyoutKeyDown}
                />
            ) : null}
            <SidebarScrollbar
                visible={scrollbarVisible}
                thumbHeight={thumbHeight}
                thumbTop={thumbTop}
            />
        </aside>
    );
}

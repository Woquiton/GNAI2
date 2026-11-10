import { useLayoutEffect, type RefObject } from 'react';

type SavedStyle = {
    fontSize: string;
    fontPriority: string;
    lineHeight: string;
    linePriority: string;
};

const LINE_MULTIPLIERS = [1, 1.3, 1.6, 2];
const ICON_SELECTOR = [
    '.fa', '.md', '[class^="ti-"]', '[class*=" ti-"]',
    '[class^="icon-"]', '[class*=" icon-"]',
    '[class^="ion-"]', '[class*=" ion-"]',
].join(', ');

function hasReadableText(element: HTMLElement): boolean {
    if (
        element.matches(ICON_SELECTOR)
        || element.closest('[aria-hidden="true"]')
        || ['SCRIPT', 'STYLE', 'SVG', 'IMG', 'VIDEO', 'CANVAS'].includes(element.tagName)
    ) return false;

    return ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)
        || Array.from(element.childNodes).some(
            (node) => node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim(),
        );
}

/** Amplia os tamanhos naturais em lote e preserva a proporção das linhas, sem multiplicar heranças. */
export function useSiteTextPresentation(
    root: RefObject<HTMLDivElement | null>,
    scale: number,
    lineHeight: number,
    active: boolean,
    readableFont: boolean,
): void {
    useLayoutEffect(() => {
        const site = root.current;
        if (!active || !site || (scale === 100 && lineHeight === 0)) return;

        const saved = new Map<HTMLElement, SavedStyle>();
        let frame = 0;
        let width = site.clientWidth;

        function restore(): void {
            saved.forEach((style, element) => {
                if (style.fontSize) element.style.setProperty('font-size', style.fontSize, style.fontPriority);
                else element.style.removeProperty('font-size');
                if (style.lineHeight) element.style.setProperty('line-height', style.lineHeight, style.linePriority);
                else element.style.removeProperty('line-height');
            });
        }

        function apply(): void {
            frame = 0;
            restore();
            saved.forEach((_, element) => {
                if (!site!.contains(element)) saved.delete(element);
            });
            const elements = Array.from(site!.querySelectorAll<HTMLElement>('*'))
                .filter((element) => element instanceof HTMLElement && hasReadableText(element));
            const measurements = elements.map((element) => {
                if (!saved.has(element)) {
                    saved.set(element, {
                        fontSize: element.style.getPropertyValue('font-size'),
                        fontPriority: element.style.getPropertyPriority('font-size'),
                        lineHeight: element.style.getPropertyValue('line-height'),
                        linePriority: element.style.getPropertyPriority('line-height'),
                    });
                }
                const style = getComputedStyle(element);
                const size = Number.parseFloat(style.fontSize);
                const height = Number.parseFloat(style.lineHeight);
                return { element, size, height: Number.isFinite(height) ? height : size * 1.5 };
            });
            const multiplier = scale / 100;
            const spacing = LINE_MULTIPLIERS[lineHeight] ?? 1;
            measurements.forEach(({ element, size, height }) => {
                if (!Number.isFinite(size) || size <= 0) return;
                element.style.setProperty('font-size', size * multiplier + 'px', 'important');
                element.style.setProperty('line-height', height * multiplier * spacing + 'px', 'important');
            });
        }

        function schedule(): void {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(apply);
        }

        apply();
        const content = new MutationObserver(schedule);
        content.observe(site, {
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['aria-hidden', 'inert'],
            subtree: true,
        });
        const resize = new ResizeObserver(() => {
            if (site.clientWidth !== width) {
                width = site.clientWidth;
                schedule();
            }
        });
        resize.observe(site);
        window.addEventListener('resize', schedule);
        return () => {
            cancelAnimationFrame(frame);
            content.disconnect();
            resize.disconnect();
            window.removeEventListener('resize', schedule);
            restore();
        };
    }, [active, lineHeight, readableFont, root, scale]);

    useLayoutEffect(() => {
        const header = root.current?.querySelector<HTMLElement>('.siteLayout__header');
        if (!active || !header) return;
        const html = document.documentElement;
        const previous = html.style.getPropertyValue('--site-public-header-height');
        const update = (): void => {
            html.style.setProperty('--site-public-header-height', header.getBoundingClientRect().height + 'px');
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(header);
        return () => {
            observer.disconnect();
            if (previous) html.style.setProperty('--site-public-header-height', previous);
            else html.style.removeProperty('--site-public-header-height');
        };
    }, [active, root]);
}

import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { loadExternalScript } from '@/utils/loadExternalScript';
import type {
    GalleryLayout,
    GalleryLayoutConstructor,
    GalleryLayoutItem,
} from './useIsotopeLayout.types';

function updateVisibility(element: HTMLElement, selector: string, filter: string): void {
    element.querySelectorAll<HTMLElement>(selector).forEach((item) => {
        const hidden = filter !== '*' && !item.matches(filter);
        item.inert = hidden;
        if (hidden) item.setAttribute('aria-hidden', 'true');
        else item.removeAttribute('aria-hidden');
    });
}

/** Reaproveita os modelos dos cards mantidos pelo React, incluindo suas transições em curso. */
function synchronizeItems(
    instance: GalleryLayout,
    element: HTMLElement,
    selector: string,
): GalleryLayoutItem[] {
    const elements = Array.from(element.querySelectorAll<HTMLElement>(selector));
    const present = new Set(elements);
    const removed = instance.items.filter((item) => !present.has(item.element));
    removed.forEach((item) => item.destroy());
    instance.items = instance.items.filter((item) => present.has(item.element));
    instance.filteredItems = instance.filteredItems.filter((item) => present.has(item.element));

    const known = new Set(instance.items.map((item) => item.element));
    const added = instance.addItems(elements.filter((item) => !known.has(item)));
    added.forEach((item) => {
        // Um único arrange define a altura final; entradas revelam no destino, sem saltar do rodapé.
        item.isHidden = true;
        item.isLayoutInstant = true;
        item.element.style.display = 'none';
    });
    const byElement = new Map(instance.items.map((item) => [item.element, item]));
    instance.items = elements.flatMap((element, index) => {
        const item = byElement.get(element);
        if (!item) return [];
        item.sortData['original-order'] = index;
        return [item];
    });
    return added;
}

/** Uses the original Isotope runtime, including its masonry and filter transitions. */
export function useIsotopeLayout<T extends HTMLElement = HTMLDivElement>(
    filter: string,
    itemSelector: string,
    items: readonly unknown[],
    options: { enabled?: boolean; onError?: () => void } = {},
): RefObject<T | null> {
    const host = useRef<T>(null);
    const layout = useRef<GalleryLayout | null>(null);
    const selected = useRef(filter);
    selected.current = filter;
    const enabled = options.enabled ?? true;
    const onError = options.onError;
    useEffect(() => {
        let disposed = false;
        let resizeObserver: ResizeObserver | undefined;
        let resizeFrame = 0;
        const element = host.current;
        if (!element || !enabled) return;
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        function arrange(): void {
            layout.current?.arrange({
                filter: selected.current,
                transitionDuration: motion.matches ? '0s' : '0.75s',
            });
        }
        const initialize = async (): Promise<void> => {
            await loadExternalScript('/assets/react/plugins/isotope/dist/isotope.pkgd.min.js');
            const images = element.querySelectorAll<HTMLImageElement>('img:not([loading="lazy"])');
            await Promise.all(Array.from(images, (img) => img.decode().catch(() => undefined)));
            if (disposed) return;
            const Isotope = (window as unknown as { Isotope: GalleryLayoutConstructor }).Isotope;
            layout.current = new Isotope(element, {
                itemSelector,
                filter: selected.current,
                animationOptions: { duration: 750, easing: 'linear', queue: false },
                transitionDuration: motion.matches ? '0s' : '0.75s',
                sortBy: 'original-order',
            });
            updateVisibility(element, itemSelector, selected.current);
            // A sidebar e o container podem mudar de largura sem um resize da janela.
            if (typeof ResizeObserver === 'undefined') return;
            let width = element.getBoundingClientRect().width;
            resizeObserver = new ResizeObserver(() => {
                const nextWidth = element.getBoundingClientRect().width;
                if (Math.abs(nextWidth - width) < 1) return;
                width = nextWidth;
                cancelAnimationFrame(resizeFrame);
                resizeFrame = requestAnimationFrame(() => layout.current?.layout());
            });
            resizeObserver.observe(element);
        };
        motion.addEventListener('change', arrange);
        void initialize().catch((error: unknown) => {
            if (disposed) return;
            if (onError) onError();
            else console.error(error);
        });
        return () => {
            disposed = true;
            motion.removeEventListener('change', arrange);
            resizeObserver?.disconnect();
            cancelAnimationFrame(resizeFrame);
            layout.current?.destroy();
            layout.current = null;
            updateVisibility(element, itemSelector, '*');
        };
    }, [itemSelector, enabled, onError]);
    useLayoutEffect(() => {
        const element = host.current;
        if (!element || !enabled) return;
        const added = layout.current ? synchronizeItems(layout.current, element, itemSelector) : [];
        layout.current?.arrange({ filter });
        added.forEach((item) => {
            delete item.isLayoutInstant;
        });
        updateVisibility(element, itemSelector, filter);
    }, [items, filter, itemSelector, enabled]);
    return host;
}

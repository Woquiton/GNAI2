import { useEffect, useRef, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadExternalScript } from '@/utils/loadExternalScript';
import type { OwlCarouselOptions, OwlCollection } from './OwlCarousel.types';
import '@styles/components/UI/OwlCarousel/OwlCarousel.plugin.css';
import '@styles/components/UI/OwlCarousel/OwlCarousel.theme.css';
import '@styles/components/UI/OwlCarousel/OwlCarousel.css';

interface OwlCarouselProps {
    children: ReactNode;
    options: OwlCarouselOptions;
    theme?: boolean;
    label: string;
    /** Ações dos slides estáticos, encaminhadas pelo host inclusive após o Owl montar o DOM. */
    onAction?: (action: string, id: string) => void;
}

/** React owns the host; Owl owns only its generated track, clones and drag events. */
export default function OwlCarousel({
    children,
    options,
    theme = false,
    label,
    onAction,
}: OwlCarouselProps): React.JSX.Element {
    const host = useRef<HTMLDivElement>(null);
    const owl = useRef<OwlCollection | undefined>(undefined);
    const activeIndex = useRef(0);
    const markup = renderToStaticMarkup(<>{children}</>);
    useEffect(() => {
        let cancelled = false;
        let collection: OwlCollection | undefined;
        let carousel: HTMLDivElement | undefined;
        let observer: ResizeObserver | undefined;
        let lastWidth = 0;
        async function initialize(): Promise<void> {
            await loadExternalScript('/assets/js/jquery.min.js');
            await loadExternalScript('/assets/plugins/owl.carousel/owl.carousel.min.js');
            if (cancelled || !host.current) return;
            carousel = document.createElement('div');
            carousel.className = `owl-carousel${theme ? ' owl-theme' : ''}`;
            const template = document.createElement('template');
            template.innerHTML = markup;
            template.content
                .querySelectorAll('link[rel="preload"][as="image"]')
                .forEach((preload) => preload.remove());
            carousel.append(template.content);
            host.current.append(carousel);
            const runtime = (window as unknown as { jQuery: (element: Element) => OwlCollection })
                .jQuery;
            collection = runtime(carousel);
            owl.current = collection;
            const update = (): void => {
                const instance = collection?.data('owl.carousel');
                if (!instance || !host.current || !carousel) return;
                host.current.dataset.activeIndex = String(instance.relative(instance.current()));
                activeIndex.current = instance.relative(instance.current());
                host.current.dataset.visibleItems = String(instance.settings.items);
                // As cópias do loop saem do Tab e do leitor de tela; os slides originais ficam.
                carousel.querySelectorAll<HTMLElement>('.owl-item').forEach((item) => {
                    item.inert = item.classList.contains('cloned');
                });
                carousel.querySelectorAll<HTMLElement>('.owl-dot').forEach((dot, index) => {
                    dot.setAttribute('role', 'button');
                    dot.setAttribute('tabindex', '0');
                    dot.setAttribute('aria-label', `Página ${index + 1}`);
                    dot.setAttribute(
                        'aria-current',
                        dot.classList.contains('active') ? 'true' : 'false',
                    );
                });
            };
            collection.on(
                'initialized.owl.carousel.react changed.owl.carousel.react refreshed.owl.carousel.react translated.owl.carousel.react',
                update,
            );
            collection.owlCarousel({
                ...options,
                startPosition: options.startPosition ?? activeIndex.current,
            });
            update();
            // The original engine listens to window resize; also cover sidebar/container changes.
            lastWidth = host.current.clientWidth;
            observer = new ResizeObserver(() => {
                const width = host.current?.clientWidth ?? 0;
                if (width > 0 && width !== lastWidth) {
                    lastWidth = width;
                    const instance = collection?.data('owl.carousel') as
                        { refresh?: () => void } | undefined;
                    instance?.refresh?.();
                }
            });
            observer.observe(host.current);
        }
        void initialize().catch(console.error);
        return () => {
            cancelled = true;
            owl.current = undefined;
            observer?.disconnect();
            collection?.off('.react');
            collection?.data('owl.carousel')?.destroy();
            carousel?.remove();
        };
    }, [markup, options, theme]);
    return (
        <div
            className={`owlCarouselRuntime${theme ? ' owlCarouselRuntime--themed' : ''}`}
            ref={host}
            role="region"
            aria-label={label}
            onClick={(event) => {
                const target = event.target as Element;
                const action = target.closest<HTMLElement>('[data-carousel-action]');
                if (action && event.currentTarget.contains(action)) {
                    const button = target.closest<HTMLButtonElement>('button');
                    if (!button || button.disabled) return;
                    event.preventDefault();
                    event.stopPropagation();
                    onAction?.(
                        action.dataset.carouselAction ?? '',
                        action.dataset.carouselId ?? '',
                    );
                    return;
                }
                if (target.closest('a[href="#"]')) event.preventDefault();
            }}
            // Com o foco dentro do carrossel a rotação para (WCAG 2.2.2) e não tira o slide focado da tela.
            onFocus={(event) => {
                if (options.autoplay) owl.current?.trigger('stop.owl.autoplay');
                const item = (event.target as Element).closest<HTMLElement>('.owl-item');
                if (!item?.parentElement || item.classList.contains('active')) return;
                // O Tab chegou a um slide fora da tela: o carrossel vai até ele.
                const originals = Array.from(
                    item.parentElement.querySelectorAll(':scope > .owl-item:not(.cloned)'),
                );
                const outer = item.closest<HTMLElement>('.owl-stage-outer');
                if (outer) outer.scrollLeft = 0;
                const index = originals.indexOf(item);
                if (index >= 0) owl.current?.trigger('to.owl.carousel', [index, 0]);
            }}
            onBlur={(event) => {
                if (
                    options.autoplay &&
                    !event.currentTarget.contains(event.relatedTarget as Node | null)
                ) {
                    owl.current?.trigger('play.owl.autoplay');
                }
            }}
            onKeyDown={(event) => {
                const dot = (event.target as Element).closest<HTMLElement>('.owl-dot');
                if (dot && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    dot.click();
                }
            }}
        />
    );
}

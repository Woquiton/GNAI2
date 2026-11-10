import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import { isInteractiveElement } from '@/utils/carouselInteraction';
import ImageDisplay from '@/components/UI/ImageDisplay/ImageDisplay';
import '@styles/components/UI/BootstrapCarousel/BootstrapCarousel.css';

export interface BootstrapCarouselSlide {
    alt: string;
    caption?: {
        text: string;
        title: string;
    };
    src: string;
}

interface BootstrapCarouselProps {
    ariaLabel: string;
    itemLabel?: string;
    controls?: boolean;
    autoplay?: boolean;
    showPause?: boolean;
    renderSlide?: (slide: BootstrapCarouselSlide, index: number) => ReactNode;
    interval?: number;
    slides: BootstrapCarouselSlide[];
}

type CarouselDirection = 'next' | 'prev';

export default function BootstrapCarousel({
    ariaLabel,
    itemLabel = 'imagem',
    controls = false,
    autoplay = true,
    showPause = false,
    renderSlide,
    interval = 5000,
    slides,
}: BootstrapCarouselProps): React.JSX.Element {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [previousIndex, setPreviousIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState<CarouselDirection>('next');
    const [paused, setPaused] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const animationTimerRef = useRef<number | null>(null);
    const dragStartXRef = useRef<number | null>(null);
    const rotationIntent = useRef<boolean | null>(null);
    const carousel = useRef<HTMLDivElement>(null);

    const [stopped, setStopped] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [motionPaused, setMotionPaused] = useState(false);
    const slideCount = slides.length;

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = (): void => setReducedMotion(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        const site = carousel.current?.closest<HTMLElement>('.siteLayout');
        if (!site) return;
        const update = (): void => setMotionPaused(site.dataset.sitePauseMotion === 'true');
        update();
        const observer = new MutationObserver(update);
        observer.observe(site, { attributes: true, attributeFilter: ['data-site-pause-motion'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (activeIndex >= slideCount) {
            setActiveIndex(0);
            setPreviousIndex(null);
        }
    }, [activeIndex, slideCount]);

    const nextIndex = useMemo(
        (): number => (activeIndex + 1) % slideCount,
        [activeIndex, slideCount],
    );
    const previousSlideIndex = useMemo(
        (): number => (activeIndex - 1 + slideCount) % slideCount,
        [activeIndex, slideCount],
    );

    function goTo(targetIndex: number, requestedDirection?: CarouselDirection): void {
        if (slideCount < 2 || targetIndex === activeIndex || isAnimating) {
            return;
        }

        if (animationTimerRef.current !== null) {
            window.clearTimeout(animationTimerRef.current);
        }

        const inferredDirection =
            requestedDirection ?? (targetIndex > activeIndex ? 'next' : 'prev');
        setPreviousIndex(activeIndex);
        setDirection(inferredDirection);
        setActiveIndex(targetIndex);
        setIsAnimating(true);

        animationTimerRef.current = window.setTimeout(() => {
            setPreviousIndex(null);
            setIsAnimating(false);
            animationTimerRef.current = null;
        }, reducedMotion || motionPaused ? 0 : 600);
    }

    useEffect(() => {
        if (
            !autoplay ||
            stopped ||
            reducedMotion ||
            motionPaused ||
            slideCount < 2 ||
            paused ||
            isAnimating
        ) {
            return undefined;
        }

        const timerId = window.setInterval(() => {
            goTo((activeIndex + 1) % slideCount, 'next');
        }, interval);

        return () => {
            window.clearInterval(timerId);
        };
    }, [
        activeIndex,
        interval,
        isAnimating,
        paused,
        slideCount,
        autoplay,
        stopped,
        reducedMotion,
        motionPaused,
    ]);

    useEffect(
        () => () => {
            if (animationTimerRef.current !== null) {
                window.clearTimeout(animationTimerRef.current);
            }
        },
        [],
    );

    return (
        <div
            ref={carousel}
            className="bootstrapCarousel slide"
            role="region"
            aria-roledescription="carrossel"
            aria-label={ariaLabel}
            onFocusCapture={(event) => {
                // Ao entrar pelo teclado, só uma ação explícita pode retomar a rotação.
                if (!event.currentTarget.contains(event.relatedTarget)) setStopped(true);
            }}
            data-active-index={activeIndex}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
                if (isInteractiveElement(event.target)) {
                    return;
                }

                dragStartXRef.current = event.clientX;
                setPaused(true);
                try {
                    event.currentTarget.setPointerCapture(event.pointerId);
                } catch {
                    // Some synthetic or browser-translated pointer events cannot be captured.
                }
            }}
            onPointerUp={(event: React.PointerEvent<HTMLDivElement>) => {
                const dragStartX = dragStartXRef.current;
                dragStartXRef.current = null;
                setPaused(false);

                if (dragStartX === null) {
                    return;
                }

                const deltaX = event.clientX - dragStartX;

                if (Math.abs(deltaX) < 40) {
                    return;
                }

                if (deltaX < 0) {
                    goTo(nextIndex, 'next');
                    return;
                }

                goTo(previousSlideIndex, 'prev');
            }}
            onPointerCancel={() => {
                dragStartXRef.current = null;
                setPaused(false);
            }}
        >
            {showPause && autoplay && slideCount > 1 && !reducedMotion && !motionPaused ? (
                <button
                    type="button"
                    className="bootstrapCarousel__pause"
                    title={stopped ? 'Retomar apresentação' : 'Pausar apresentação'}
                    onPointerDown={() => { rotationIntent.current = !stopped; }}
                    onPointerCancel={() => { rotationIntent.current = null; }}
                    onPointerLeave={() => { rotationIntent.current = null; }}
                    onBlur={() => { rotationIntent.current = null; }}
                    onClick={() => {
                        setStopped(rotationIntent.current ?? !stopped);
                        rotationIntent.current = null;
                    }}
                >
                    {stopped ? 'Retomar' : 'Pausar'}
                </button>
            ) : null}
            <ol className="bootstrapCarousel__indicators">
                {slides.map((slide: BootstrapCarouselSlide, index: number) => (
                    <li
                        key={`${slide.src}-indicator`}
                        className={index === activeIndex ? 'active' : undefined}
                        aria-label={`Slide ${index + 1}`}
                    >
                        <button
                            type="button"
                            aria-label={`Mostrar ${itemLabel} ${index + 1}`}
                            aria-current={index === activeIndex ? 'true' : undefined}
                            title={`Mostrar ${itemLabel} ${index + 1}`}
                            onClick={() => goTo(index)}
                        />
                    </li>
                ))}
            </ol>

            <div
                className="bootstrapCarousel__inner"
                aria-live={!autoplay || stopped || reducedMotion || motionPaused ? 'polite' : 'off'}
                aria-atomic="false"
            >
                {slides.map((slide: BootstrapCarouselSlide, index: number) => {
                    const isActive = index === activeIndex;
                    const isPrevious = previousIndex === index;

                    return (
                        <div
                            key={slide.src}
                            inert={!isActive}
                            aria-hidden={!isActive}
                            role="group"
                            aria-roledescription={itemLabel}
                            aria-label={`${index + 1} de ${slideCount}`}
                            className={joinClassNames(
                                'bootstrapCarousel__item',
                                isActive ? 'active' : undefined,
                                isPrevious ? 'bootstrapCarousel__item--leaving' : undefined,
                                isActive && previousIndex !== null
                                    ? 'bootstrapCarousel__item--entering'
                                    : undefined,
                                (isActive || isPrevious) && direction === 'next'
                                    ? 'bootstrapCarousel__item--next'
                                    : undefined,
                                (isActive || isPrevious) && direction === 'prev'
                                    ? 'bootstrapCarousel__item--prev'
                                    : undefined,
                            )}
                        >
                            {renderSlide ? (
                                renderSlide(slide, index)
                            ) : (
                                <ImageDisplay
                                    src={slide.src}
                                    alt={slide.alt}
                                    className="bootstrapCarousel__image"
                                />
                            )}
                            {slide.caption ? (
                                <div className="bootstrapCarousel__caption">
                                    <h3>{slide.caption.title}</h3>
                                    <p>{slide.caption.text}</p>
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            {controls && slideCount > 1 ? (
                <>
                    <button
                        type="button"
                        className="bootstrapCarousel__control bootstrapCarousel__control--left"
                        title="Anterior"
                        onClick={(event) => {
                            event.preventDefault();
                            goTo(previousSlideIndex, 'prev');
                        }}
                    >
                        <span aria-hidden="true" className="fa fa-angle-left" />
                        <span className="bootstrapCarousel__srOnly">Anterior</span>
                    </button>
                    <button
                        type="button"
                        className="bootstrapCarousel__control bootstrapCarousel__control--right"
                        title="Próximo"
                        onClick={(event) => {
                            event.preventDefault();
                            goTo(nextIndex, 'next');
                        }}
                    >
                        <span aria-hidden="true" className="fa fa-angle-right" />
                        <span className="bootstrapCarousel__srOnly">Próximo</span>
                    </button>
                </>
            ) : null}
        </div>
    );
}

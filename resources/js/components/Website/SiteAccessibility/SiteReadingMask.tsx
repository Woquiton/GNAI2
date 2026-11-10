import { useEffect, useState } from 'react';
import { isKeyboardFocusMode } from '@/utils/accessibilityPreferences';

/** Faixa visual que acompanha o ponteiro ou o foco, sem interceptar clique ou teclado. */
export default function SiteReadingMask(): React.JSX.Element {
    const [top, setTop] = useState(0);

    useEffect(() => {
        let frame = 0;
        let position = window.innerHeight / 2;
        const measure = (): void => {
            frame = 0;
            const zoom = Number.parseFloat(
                getComputedStyle(document.documentElement)
                    .getPropertyValue('--ui-accessibility-scale'),
            ) || 1;
            setTop(Math.max(0, Math.min(
                window.innerHeight / zoom - 140,
                position / zoom - 70,
            )));
        };
        const schedule = (): void => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(measure);
        };
        const pointer = (event: PointerEvent): void => {
            position = event.clientY;
            schedule();
        };
        const focus = (): void => {
            const element = document.activeElement;
            if (element instanceof HTMLElement && element.closest('.siteLayout')) {
                const rect = element.getBoundingClientRect();
                position = rect.top + rect.height / 2;
                schedule();
            }
        };
        const scroll = (): void => {
            if (isKeyboardFocusMode()) focus();
        };
        schedule();
        document.addEventListener('pointermove', pointer, { passive: true });
        document.addEventListener('focusin', focus);
        window.addEventListener('scroll', scroll, true);
        window.addEventListener('resize', schedule);
        return () => {
            cancelAnimationFrame(frame);
            document.removeEventListener('pointermove', pointer);
            document.removeEventListener('focusin', focus);
            window.removeEventListener('scroll', scroll, true);
            window.removeEventListener('resize', schedule);
        };
    }, []);

    return (
        <div
            className="siteReadingMask"
            data-site-accessibility-overlay=""
            aria-hidden="true"
            style={{ top }}
        />
    );
}

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import './FormActions.css';

interface FormActionsProps {
    children: ReactNode;
    secondary?: ReactNode;
    status?: ReactNode;
    className?: string;
}

export default function FormActions({
    children,
    secondary,
    status,
    className,
}: FormActionsProps): React.JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLElement>(null);
    const [fixed, setFixed] = useState(true);

    // No celular a barra fica sempre colada na base da tela; a página reserva a altura dela.
    useEffect(() => {
        const bar = barRef.current;
        const root = document.documentElement;
        if (!bar || typeof ResizeObserver === 'undefined') return;

        const observer = new ResizeObserver(() => {
            root.style.setProperty('--form-actions-height', `${bar.offsetHeight}px`);
        });

        observer.observe(bar);

        return () => {
            observer.disconnect();
            root.style.removeProperty('--form-actions-height');
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;

        if (!container || typeof IntersectionObserver === 'undefined') {
            setFixed(false);
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            setFixed(!entry.isIntersecting);
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className={joinClassNames('formActions', className)}>
            <footer
                ref={barRef}
                className={joinClassNames('formActions__bar', fixed && 'formActions__bar--fixed')}
            >
                <div className="formActions__leading">
                    {secondary ? <div className="formActions__secondary">{secondary}</div> : null}
                    {status ? (
                        <span className="formActions__status" role="status">
                            {status}
                        </span>
                    ) : null}
                </div>
                <div className="formActions__primary">{children}</div>
                <div className="formActions__balance" aria-hidden="true" />
            </footer>
        </div>
    );
}

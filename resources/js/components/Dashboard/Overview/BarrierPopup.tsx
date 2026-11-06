import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import Button from '@/components/UI/Button/Button';
import Label from '@/components/UI/Label/Label';
import { bindWaves } from '@/utils/initWaves';
import type { Barrier } from './Overview.types';
import '@styles/components/Dashboard/Overview/BarrierPopup.css';

export default function BarrierPopup({ barrier }: { barrier: Barrier }): React.JSX.Element {
    const ref = useRef<HTMLElement>(null);

    // O Leaflet não deixa o clique do popup chegar ao body, onde o efeito waves é escutado.
    useEffect(() => (ref.current ? bindWaves(ref.current) : undefined), []);

    const tones = {
        secondary: 'default',
        info: 'info',
        warning: 'warning',
        success: 'success',
        danger: 'danger',
    } as const;
    const tone = tones[barrier.color as keyof typeof tones] ?? 'default';
    return (
        <section ref={ref} aria-label={`Barreira: ${barrier.name}`}>
            <h3 className="barrierPopup__title">{barrier.name}</h3>
            <div className="barrierPopup__content">
                <p className="barrierPopup__category">{barrier.category_name}</p>
                <Label variant={tone}>{barrier.status_label}</Label>
                <div className="barrierPopup__actions">
                    <Button
                        href={barrier.url}
                        size="sm"
                        tone="dark-blue"
                        leftIconClass="fa fa-eye"
                        label="Visualizar"
                        title={`Visualizar barreira ${barrier.name}`}
                        onClick={(event) => {
                            if (
                                event.button !== 0 ||
                                event.ctrlKey ||
                                event.metaKey ||
                                event.shiftKey ||
                                event.altKey
                            )
                                return;
                            if (new URL(event.currentTarget.href).origin !== window.location.origin)
                                return;
                            event.preventDefault();
                            router.visit(barrier.url);
                        }}
                    />
                </div>
            </div>
        </section>
    );
}

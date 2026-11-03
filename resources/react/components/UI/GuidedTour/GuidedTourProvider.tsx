import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { GuidedTourDefinition } from './GuidedTour.types';
import GuidedTour from './GuidedTour';
import {
    GuidedTourRegistryContext,
    GuidedTourStateContext,
    type GuidedTourState,
} from './GuidedTourContext';

/**
 * Guarda o tutorial da tela montada e abre o cartão do tutorial sobre ela. Fica no layout,
 * envolvendo a barra do topo (que oferece o botão) e o conteúdo (que registra o tutorial).
 */
export default function GuidedTourProvider({
    children,
}: {
    children: ReactNode;
}): React.JSX.Element {
    const [tour, setTour] = useState<GuidedTourDefinition | null>(null);
    const [active, setActive] = useState(false);

    // Sair da tela remove o tutorial dela e fecha o cartão, inclusive ao navegar pelo próprio cartão.
    const register = useCallback((next: GuidedTourDefinition) => {
        setTour(next);

        return () => {
            setTour((current) => (current === next ? null : current));
            setActive(false);
        };
    }, []);

    const start = useCallback(() => setActive(true), []);
    const stop = useCallback(() => setActive(false), []);
    const state = useMemo<GuidedTourState>(
        () => ({ available: tour !== null, active: active && tour !== null, start, stop }),
        [tour, active, start, stop],
    );

    return (
        <GuidedTourRegistryContext.Provider value={register}>
            <GuidedTourStateContext.Provider value={state}>
                {children}
                {state.active && tour ? <GuidedTour tour={tour} onClose={stop} /> : null}
            </GuidedTourStateContext.Provider>
        </GuidedTourRegistryContext.Provider>
    );
}

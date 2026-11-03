import { useContext, useEffect } from 'react';
import type { GuidedTourDefinition } from './GuidedTour.types';
import {
    GuidedTourRegistryContext,
    GuidedTourStateContext,
    type GuidedTourState,
} from './GuidedTourContext';

/**
 * Disponibiliza o tutorial enquanto a tela estiver montada. Passe um objeto estável
 * (constante de módulo ou `useMemo`) para não registrar de novo a cada renderização.
 */
export function useGuidedTourRegistration(tour: GuidedTourDefinition | null): void {
    const register = useContext(GuidedTourRegistryContext);

    useEffect(() => (tour ? register(tour) : undefined), [register, tour]);
}

/** Estado do tutorial da tela atual, para o botão da barra do topo. */
export function useGuidedTourState(): GuidedTourState {
    return useContext(GuidedTourStateContext);
}

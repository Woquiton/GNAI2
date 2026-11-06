import { createContext } from 'react';
import type { GuidedTourDefinition } from './GuidedTour.types';

/** Registra o tutorial da tela montada e devolve a função que o remove ao desmontar. */
export type RegisterGuidedTour = (tour: GuidedTourDefinition) => () => void;

export interface GuidedTourState {
    /** A tela atual tem tutorial. */
    available: boolean;
    /** O tutorial está aberto. */
    active: boolean;
    start: () => void;
    stop: () => void;
}

/** Separado do estado para que registrar o tutorial não renderize a página de novo. */
export const GuidedTourRegistryContext = createContext<RegisterGuidedTour>(() => () => undefined);

export const GuidedTourStateContext = createContext<GuidedTourState>({
    available: false,
    active: false,
    start: () => undefined,
    stop: () => undefined,
});

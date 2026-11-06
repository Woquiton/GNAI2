import { createContext } from 'react';

/**
 * Permite que controles internos do card (como a quantidade por página) acionem o mesmo
 * indicador de carregamento das recargas da listagem.
 */
export const TableListBusyContext = createContext<(busy: boolean) => void>(() => undefined);

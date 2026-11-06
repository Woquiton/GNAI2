import type { ReactNode } from 'react';
import '@styles/components/UI/TableLabel/TableLabel.css';

export type TableLabelTone =
    'success' | 'primary' | 'inverse' | 'danger' | 'warning' | 'info' | 'purple';

/** Etiqueta curta de status e classificação em tabelas e visualizações. */
export default function TableLabel({
    tone = 'success',
    children,
}: {
    /** Tons com estilo em TableLabel.css; aceita strings vindas de mapas existentes. */
    tone?: TableLabelTone | (string & {});
    children: ReactNode;
}): React.JSX.Element {
    return <span className={`tableLabel tableLabel--${tone}`}>{children}</span>;
}

import type { CSSProperties, ReactNode } from 'react';
import '@styles/components/UI/TableLabel/TableLabel.css';

export type TableLabelTone =
    'success' | 'primary' | 'inverse' | 'danger' | 'warning' | 'info' | 'purple';

/** Etiqueta curta de status e classificação em tabelas e visualizações. */
export default function TableLabel({
    tone = 'success',
    style,
    children,
}: {
    /** Tons com estilo em TableLabel.css; aceita strings vindas de mapas existentes. */
    tone?: TableLabelTone | (string & {});
    style?: CSSProperties;
    children: ReactNode;
}): React.JSX.Element {
    return (
        <span className={`tableLabel tableLabel--${tone}`} style={style}>
            {children}
        </span>
    );
}

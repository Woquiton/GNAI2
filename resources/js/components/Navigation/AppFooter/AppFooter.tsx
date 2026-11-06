import type { ReactNode } from 'react';
import '@styles/components/Navigation/AppFooter/AppFooter.css';

export default function AppFooter({
    children = 'Biblioteca de componentes',
    id,
}: {
    children?: ReactNode;
    /** Alvo do atalho "Rodapé" da barra de acessibilidade. */
    id?: string;
}): React.JSX.Element {
    return (
        <footer id={id} className="appFooter footer">
            {children}
        </footer>
    );
}

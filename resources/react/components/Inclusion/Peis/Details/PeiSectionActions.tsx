import type { ReactNode } from 'react';
import './PeiSectionActions.css';

interface PeiSectionActionsProps {
    children: ReactNode;
}

/** Ações próprias de uma seção (salvar formulário embutido, abrir registro vinculado). */
export default function PeiSectionActions({ children }: PeiSectionActionsProps): React.JSX.Element {
    return <div className="peiSectionActions">{children}</div>;
}

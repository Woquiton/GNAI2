import type { HTMLAttributes, ReactNode } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import './EmptyText.css';

interface EmptyTextProps extends HTMLAttributes<HTMLParagraphElement> {
    children: ReactNode;
}

/**
 * Texto discreto de uma seção, lista ou aba sem registros ("Nenhum PAEE vinculado..."). Estados
 * vazios de tabelas usam `TableListEmpty`; valores múltiplos vazios usam `TagList`.
 */
export default function EmptyText({
    children,
    className,
    ...attributes
}: EmptyTextProps): React.JSX.Element {
    return (
        <p {...attributes} className={joinClassNames('emptyText', className)}>
            {children}
        </p>
    );
}

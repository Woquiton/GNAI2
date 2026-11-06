import type { ReactNode } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import '@styles/components/UI/DetailGrid/DetailGrid.css';

interface DetailGridProps {
    children: ReactNode;
    columns?: 2 | 3 | 4;
    className?: string;
}

/**
 * Lista de descrição (`<dl>`) em grade responsiva para telas de visualização. Combine com
 * `DetailField` dentro de `FormSection variant="inline"`.
 */
export default function DetailGrid({
    children,
    columns = 2,
    className,
}: DetailGridProps): React.JSX.Element {
    return (
        <dl className={joinClassNames('detailGrid', `detailGrid--${columns}`, className)}>
            {children}
        </dl>
    );
}

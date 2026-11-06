import type { ElementType, ReactNode } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';

interface CardBoxProps {
    as?: ElementType;
    children: ReactNode;
    className?: string;
    /** Valor de `data-tour`, para o tutorial ao vivo destacar o card. */
    tourTarget?: string;
}

export default function CardBox({
    as: Component = 'div',
    children,
    className,
    tourTarget,
}: CardBoxProps): React.JSX.Element {
    return (
        <Component className={joinClassNames('card-box', className)} data-tour={tourTarget}>
            {children}
        </Component>
    );
}

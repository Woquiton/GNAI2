import type { Key, ReactNode } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import './TagList.css';

interface TagListItem {
    id: Key;
    name: ReactNode;
}

interface TagListProps {
    items: readonly TagListItem[];
    /** Texto exibido quando a lista está vazia. */
    emptyMessage: string;
    className?: string;
}

/** Valores múltiplos de uma visualização (público-alvo, recursos, deficiências) como etiquetas. */
export default function TagList({
    items,
    emptyMessage,
    className,
}: TagListProps): React.JSX.Element {
    if (!items.length) {
        return <span className="tagList__empty">{emptyMessage}</span>;
    }

    return (
        <ul className={joinClassNames('tagList', className)}>
            {items.map((item) => (
                <li key={item.id} className="tagList__item">
                    {item.name}
                </li>
            ))}
        </ul>
    );
}

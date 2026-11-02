import type { Key, ReactNode } from 'react';
import './PeiTimeline.css';
import EmptyText from '@/components/UI/EmptyText/EmptyText';

interface PeiTimelineProps<T> {
    /** Subtítulo do grupo dentro da seção. */
    title?: string;
    items: readonly T[];
    itemKey: (item: T) => Key;
    renderItem: (item: T) => ReactNode;
    emptyMessage: string;
}

/** Registros datados do PEI (atendimentos, acompanhamentos, devolutivas e revisões). */
export default function PeiTimeline<T>({
    title,
    items,
    itemKey,
    renderItem,
    emptyMessage,
}: PeiTimelineProps<T>): React.JSX.Element {
    const content = items.length ? (
        <ul className="peiTimeline__list">
            {items.map((item) => (
                <li key={itemKey(item)} className="peiTimeline__item">
                    {renderItem(item)}
                </li>
            ))}
        </ul>
    ) : (
        <EmptyText>{emptyMessage}</EmptyText>
    );

    return (
        <div className="peiTimeline">
            {title ? <h3 className="peiTimeline__title">{title}</h3> : null}
            {content}
        </div>
    );
}

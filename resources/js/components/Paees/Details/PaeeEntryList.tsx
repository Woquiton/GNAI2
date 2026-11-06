import type { Key, ReactNode } from 'react';
import '@styles/components/Paees/Details/PaeeEntryList.css';
import EmptyText from '@/components/UI/EmptyText/EmptyText';

interface PaeeEntryListProps<T> {
    items: readonly T[];
    itemKey: (item: T) => Key;
    /** Texto exibido quando não há registros. */
    emptyMessage: string;
    renderItem: (item: T) => ReactNode;
}

/** Registros vinculados ao PAEE (objetivos, recursos e revisões), um bloco contornado por item. */
export default function PaeeEntryList<T>({
    items,
    itemKey,
    emptyMessage,
    renderItem,
}: PaeeEntryListProps<T>): React.JSX.Element {
    if (!items.length) {
        return <EmptyText>{emptyMessage}</EmptyText>;
    }

    return (
        <ul className="paeeEntryList">
            {items.map((item) => (
                <li key={itemKey(item)} className="paeeEntryList__item">
                    {renderItem(item)}
                </li>
            ))}
        </ul>
    );
}

import type { Key, ReactNode } from 'react';
import './CaseStudyEntryList.css';
import EmptyText from '@/components/UI/EmptyText/EmptyText';

interface CaseStudyEntryListProps<T> {
    items: readonly T[];
    itemKey: (item: T) => Key;
    renderItem: (item: T) => ReactNode;
    emptyMessage: string;
}

/** Registros textuais do Estudo de Caso (barreiras, estratégias e contribuições) em blocos. */
export default function CaseStudyEntryList<T>({
    items,
    itemKey,
    renderItem,
    emptyMessage,
}: CaseStudyEntryListProps<T>): React.JSX.Element {
    if (!items.length) {
        return <EmptyText>{emptyMessage}</EmptyText>;
    }

    return (
        <ul className="caseStudyEntryList">
            {items.map((item) => (
                <li key={itemKey(item)} className="caseStudyEntryList__item">
                    {renderItem(item)}
                </li>
            ))}
        </ul>
    );
}

/** Texto simples digitado em textarea, preservando as quebras de linha. */
export function CaseStudyEntryText({ children }: { children: ReactNode }): React.JSX.Element {
    return <p className="caseStudyEntryList__text">{children}</p>;
}

/** Dado complementar (implicação, barreira relacionada, data), com quebras de linha. */
export function CaseStudyEntryMeta({ children }: { children: ReactNode }): React.JSX.Element {
    return <small className="caseStudyEntryList__meta">{children}</small>;
}

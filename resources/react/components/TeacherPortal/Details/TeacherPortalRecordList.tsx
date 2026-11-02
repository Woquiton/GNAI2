import type { Key, ReactNode } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import './TeacherPortalDetails.css';
import EmptyText from '@/components/UI/EmptyText/EmptyText';

interface TeacherPortalRecordListProps<T> {
    /** Subtítulo exibido acima da lista; omita quando a seção já nomeia o conteúdo. */
    title?: string;
    items: readonly T[];
    itemKey: (item: T) => Key;
    renderItem: (item: T) => ReactNode;
    className?: string;
    itemClassName?: string;
}

/** Coleção somente leitura de uma seção (barreiras, objetivos...); vazia não é exibida. */
export default function TeacherPortalRecordList<T>({
    title,
    items,
    itemKey,
    renderItem,
    className,
    itemClassName,
}: TeacherPortalRecordListProps<T>): React.JSX.Element | null {
    if (!items.length) {
        return null;
    }

    return (
        <>
            {title ? <h3 className="teacherPortal__subheading">{title}</h3> : null}
            <ul className={joinClassNames('teacherPortal__list', className)}>
                {items.map((item) => (
                    <li
                        key={itemKey(item)}
                        className={joinClassNames('teacherPortal__listItem', itemClassName)}
                    >
                        {renderItem(item)}
                    </li>
                ))}
            </ul>
        </>
    );
}

/** Texto simples com quebras de linha preservadas; vazio aparece como `---`. */
export function TeacherPortalText({
    value,
}: {
    value: string | null | undefined;
}): React.JSX.Element {
    return <span className="teacherPortal__text">{value?.trim() ? value : '---'}</span>;
}

/** Mensagem de seção sem registro, no mesmo parágrafo discreto das demais seções do portal. */
export function TeacherPortalEmpty({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}): React.JSX.Element {
    return <EmptyText className={className}>{children}</EmptyText>;
}

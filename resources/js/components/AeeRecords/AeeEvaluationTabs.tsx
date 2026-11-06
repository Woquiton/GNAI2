import type { ReactNode } from 'react';
import RecordTabs from '@/components/Navigation/RecordTabs/RecordTabs';
import type { TabItem } from '@/components/Navigation/Tabs/Tabs';
import '@styles/components/AeeRecords/AeeEvaluationTabs.css';
import EmptyText from '@/components/UI/EmptyText/EmptyText';

interface AeeEvaluationTabsProps {
    items: TabItem[];
    initialActiveId?: string;
    /** Texto exibido quando o registro não tem alunos avaliados. */
    emptyMessage: string;
    /** Erros da coleção de avaliações (lista vazia, aluno inválido), exibidos acima das abas. */
    errors?: string[];
}

/** Uma aba vertical por aluno, compartilhada pelo formulário e pela visualização do registro. */
export default function AeeEvaluationTabs({
    items,
    initialActiveId,
    emptyMessage,
    errors = [],
}: AeeEvaluationTabsProps): React.JSX.Element {
    const content = items.length ? (
        <RecordTabs items={items} initialActiveId={initialActiveId} />
    ) : (
        <EmptyText>{emptyMessage}</EmptyText>
    );

    return (
        <>
            {errors.length ? (
                <div className="aeeEvaluationTabs__errors">
                    {errors.map((message) => (
                        <p key={message} className="formField__error">
                            {message}
                        </p>
                    ))}
                </div>
            ) : null}
            {content}
        </>
    );
}

/** Nome do aluno na aba, seguido dos indicadores de ausência ou de campos a corrigir. */
export function AeeEvaluationTabLabel({
    name,
    children,
}: {
    name: string;
    children?: ReactNode;
}): React.JSX.Element {
    return (
        <span className="aeeEvaluationTabs__label">
            <span>{name}</span>
            {children}
        </span>
    );
}

/** Ícone de alerta da aba; o estado é anunciado pelo `accessibleLabel` da própria aba. */
export function AeeEvaluationTabIcon({ iconClass }: { iconClass: string }): React.JSX.Element {
    return <i className={`${iconClass} aeeEvaluationTabs__icon--danger`} aria-hidden="true" />;
}

/** Título "Avaliação: aluno" no início do painel de cada avaliação. */
export function AeeEvaluationTitle({ studentName }: { studentName: string }): React.JSX.Element {
    return <h3 className="aeeEvaluationTabs__title">Avaliação: {studentName}</h3>;
}

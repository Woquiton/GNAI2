import type { CSSProperties } from 'react';
import { Link } from '@inertiajs/react';
import CardBox from '@/components/UI/CardBox/CardBox';
import { joinClassNames } from '@/utils/joinClassNames';
import '@styles/components/UI/InlineMetricsCard/InlineMetricsCard.css';

export type InlineMetricTone = 'info' | 'pink' | 'purple' | 'success';

export interface InlineMetric {
    label: string;
    value: number;
    /** Classe completa do ícone, como `fa fa-book`. */
    iconClass: string;
    tone: InlineMetricTone;
    /** Listagem correspondente; sem ela, o indicador não é link. */
    href?: string;
}

interface InlineMetricsCardProps {
    items: InlineMetric[];
    /** Nome do conjunto para leitores de tela. */
    label: string;
    className?: string;
    /** Valor de `data-tour`, para o tutorial ao vivo destacar o card. */
    tourTarget?: string;
}

/**
 * Widget "inline" do Ubold: vários indicadores num único card, lado a lado e separados por
 * divisórias, com ícone e valor em cima e o rótulo embaixo. Até quatro por linha.
 */
export default function InlineMetricsCard({
    items,
    label,
    className,
    tourTarget,
}: InlineMetricsCardProps): React.JSX.Element {
    const columns = { '--inline-metrics-columns': Math.min(items.length, 4) } as CSSProperties;

    return (
        <CardBox className={joinClassNames('inlineMetricsCard', className)} tourTarget={tourTarget}>
            <ul className="inlineMetricsCard__list" aria-label={label} style={columns}>
                {items.map((item) => {
                    const content = (
                        <>
                            <span className="inlineMetricsCard__value">
                                <i
                                    className={joinClassNames(
                                        item.iconClass,
                                        `inlineMetricsCard__icon--${item.tone}`,
                                    )}
                                    aria-hidden="true"
                                />
                                <b>{item.value.toLocaleString('pt-BR')}</b>
                            </span>
                            <span className="inlineMetricsCard__label">{item.label}</span>
                        </>
                    );

                    return (
                        <li key={item.label} className="inlineMetricsCard__item">
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="inlineMetricsCard__box"
                                    aria-label={`${item.label}: ${item.value.toLocaleString('pt-BR')}`}
                                >
                                    {content}
                                </Link>
                            ) : (
                                <div className="inlineMetricsCard__box">{content}</div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </CardBox>
    );
}

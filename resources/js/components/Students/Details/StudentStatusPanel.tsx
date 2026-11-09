import { useId } from 'react';
import Button, { type ButtonTone } from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { StudentStatusItem, StudentStatusPanelData } from '../Students.types';
import { STUDENT_TOUR_TARGETS } from '../studentTours';
import '@styles/components/Students/Details/StudentStatusPanel.css';

const STATUS_KEYS = new Set(['technical-report', 'case-study', 'paee', 'pei']);

function stepAction(item: StudentStatusItem): { icon: string; tone: ButtonTone } {
    if (item.action_label === 'Iniciar') return { icon: 'fa fa-plus', tone: 'success' };
    if (item.action_label === 'Continuar') return { icon: 'fa fa-pencil', tone: 'warning' };

    return { icon: 'fa fa-eye', tone: 'dark-blue' };
}

/** Quatro indicadores do acompanhamento, com as ações autorizadas pelo backend. */
export default function StudentStatusPanel({
    panel,
}: {
    panel: StudentStatusPanelData;
}): React.JSX.Element {
    const titleId = useId();
    const items = panel.items.filter((item) => STATUS_KEYS.has(item.key));

    return (
        <section
            className="studentStatusPanel"
            aria-labelledby={titleId}
            data-tour={STUDENT_TOUR_TARGETS.statusPanel}
        >
            <h2 id={titleId} className="studentStatusPanel__title">
                Status do atendimento
            </h2>
            <ul className="studentStatusPanel__list">
                {items.map((item) => {
                    const action = stepAction(item);
                    const actionLabel = `${item.action_label} ${item.label}`;
                    const state = item.ok ? 'ok' : 'pending';

                    return (
                        <CardBox
                            as="li"
                            key={item.key}
                            className={`studentStatusPanel__item studentStatusPanel__item--${state}`}
                        >
                            <h3 className="studentStatusPanel__label">
                                <i className={item.icon} aria-hidden="true" /> {item.label}
                            </h3>
                            <TableLabel tone={item.ok ? 'success' : 'danger'}>
                                <i
                                    className={item.ok ? 'fa fa-check-circle' : 'fa fa-clock-o'}
                                    aria-hidden="true"
                                />{' '}
                                {item.status}
                            </TableLabel>
                            {item.href ? (
                                <Button
                                    href={item.href}
                                    tone={action.tone}
                                    size="xs"
                                    leftIconClass={action.icon}
                                    title={actionLabel}
                                    aria-label={actionLabel}
                                >
                                    {item.action_label}
                                </Button>
                            ) : null}
                            {item.updated_at ? (
                                <small className="studentStatusPanel__updated">
                                    Atualizado em {item.updated_at}
                                </small>
                            ) : null}
                        </CardBox>
                    );
                })}
            </ul>
            {panel.alerts.map((alert) => (
                <InlineAlert key={alert} variant="warning" className="studentStatusPanel__alert">
                    <i className="fa fa-exclamation-triangle" aria-hidden="true" /> {alert}
                </InlineAlert>
            ))}
        </section>
    );
}

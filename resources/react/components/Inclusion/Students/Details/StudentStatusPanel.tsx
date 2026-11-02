import Button from '@/components/UI/Button/Button';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import { joinClassNames } from '@/utils/joinClassNames';
import type { StudentStatusBox, StudentStatusPanelData } from '../Students.types';
import './StudentStatusPanel.css';

interface StudentStatusPanelProps {
    panel: StudentStatusPanelData;
    onOpenTab: (tab: string) => void;
}

/** Atalho de cada caixa: link para o documento ou abertura da aba correspondente. */
function StatusBoxAction({
    box,
    onOpenTab,
}: {
    box: StudentStatusBox;
    onOpenTab: (tab: string) => void;
}): React.JSX.Element | null {
    const action = box.ok ? 'Ver' : 'Iniciar';
    const actionLabel = `${action} ${box.label}`;
    const tab = box.tab;

    if (box.href) {
        return (
            <Button
                href={box.href}
                tone="white"
                size="xs"
                label={action}
                title={actionLabel}
                aria-label={actionLabel}
            />
        );
    }

    if (!tab) {
        return null;
    }

    return (
        <Button
            type="button"
            tone="white"
            size="xs"
            label={action}
            title={actionLabel}
            aria-label={actionLabel}
            onClick={() => onOpenTab(tab)}
        />
    );
}

/**
 * Painel "Status do atendimento": situação do laudo, Estudo de Caso, PAEE e
 * PEI vigentes do aluno, com atalho para ver ou iniciar cada documento.
 */
export default function StudentStatusPanel({
    panel,
    onOpenTab,
}: StudentStatusPanelProps): React.JSX.Element {
    return (
        <section className="studentStatusPanel" aria-labelledby="student-status-panel-title">
            <h2 id="student-status-panel-title" className="studentStatusPanel__title">
                Status do atendimento
            </h2>
            <ul className="studentStatusPanel__list">
                {panel.boxes.map((box) => (
                    <li
                        key={box.key}
                        className={joinClassNames(
                            'studentStatusPanel__item',
                            box.ok
                                ? 'studentStatusPanel__item--ok'
                                : 'studentStatusPanel__item--pending',
                        )}
                    >
                        <h3 className="studentStatusPanel__label">
                            <i className={box.icon} aria-hidden="true" /> {box.label}
                        </h3>
                        <span className="studentStatusPanel__status">
                            <i
                                className={box.ok ? 'fa fa-check-circle' : 'fa fa-times-circle'}
                                aria-hidden="true"
                            />{' '}
                            {box.status}
                        </span>
                        <StatusBoxAction box={box} onOpenTab={onOpenTab} />
                        {box.updated_at ? (
                            <small className="studentStatusPanel__updated">
                                Atualizado em {box.updated_at}
                            </small>
                        ) : null}
                    </li>
                ))}
            </ul>
            {panel.alerts.map((alert) => (
                <InlineAlert key={alert} variant="warning" className="studentStatusPanel__alert">
                    <i className="fa fa-exclamation-triangle" aria-hidden="true" /> {alert}
                </InlineAlert>
            ))}
        </section>
    );
}

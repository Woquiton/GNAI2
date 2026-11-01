import Button from '@/components/UI/Button/Button';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import type { StudentStatusPanelData } from './Students.types';

/**
 * Painel "Status do atendimento": situação do laudo, Estudo de Caso, PAEE e
 * PEI vigentes do aluno, com atalho para ver ou iniciar cada documento.
 */
export default function StudentStatusPanel({
  panel,
  onOpenTab,
}: {
  panel: StudentStatusPanelData;
  onOpenTab: (tab: string) => void;
}): React.JSX.Element {
  return (
    <section className="studentStatusPanel" aria-labelledby="student-status-panel-title">
      <h2 id="student-status-panel-title" className="studentStatusPanel__title">
        Status do atendimento
      </h2>
      <ul className="studentStatusPanel__list">
        {panel.boxes.map((box) => {
          const action = box.ok ? 'Ver' : 'Iniciar';
          const actionLabel = `${action} ${box.label}`;

          return (
            <li
              key={box.key}
              className={box.ok
                ? 'studentStatusPanel__item studentStatusPanel__item--ok'
                : 'studentStatusPanel__item studentStatusPanel__item--pending'}
            >
              <h3 className="studentStatusPanel__label">
                <i className={box.icon} aria-hidden="true" /> {box.label}
              </h3>
              <span className="studentStatusPanel__status">
                <i
                  className={box.ok ? 'fa fa-check-circle' : 'fa fa-times-circle'}
                  aria-hidden="true"
                />
                {' '}{box.status}
              </span>
              {box.href ? (
                <Button
                  href={box.href}
                  tone="white"
                  size="xs"
                  label={action}
                  title={actionLabel}
                  aria-label={actionLabel}
                />
              ) : box.tab ? (
                <Button
                  type="button"
                  tone="white"
                  size="xs"
                  label={action}
                  title={actionLabel}
                  aria-label={actionLabel}
                  onClick={() => onOpenTab(box.tab as string)}
                />
              ) : null}
              {box.updated_at ? (
                <small className="studentStatusPanel__updated">
                  Atualizado em {box.updated_at}
                </small>
              ) : null}
            </li>
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

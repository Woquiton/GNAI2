import Button from '@/components/UI/Button/Button';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import type { StudentStatusPanelData } from './Students.types';

/**
 * Situação dos registros que compõem o atendimento do aluno, em ordem de
 * dependência, com ações somente quando o fluxo e a permissão as liberam.
 */
export default function StudentStatusPanel({
  panel,
}: {
  panel: StudentStatusPanelData;
}): React.JSX.Element {
  return (
    <section className="studentStatusPanel" aria-labelledby="student-status-panel-title">
      <h2 id="student-status-panel-title" className="studentStatusPanel__title">
        Status do atendimento
      </h2>
      <ul className="studentStatusPanel__list">
        {panel.items.map((item) => {
          const actionLabel = `${item.action_label} ${item.label}`;

          return (
            <li
              key={item.key}
              className={item.ok
                ? 'studentStatusPanel__item studentStatusPanel__item--ok'
                : 'studentStatusPanel__item studentStatusPanel__item--pending'}
            >
              <h3 className="studentStatusPanel__label">
                <i className={item.icon} aria-hidden="true" /> {item.label}
              </h3>
              <span className="studentStatusPanel__status">
                <i
                  className={item.ok ? 'fa fa-check-circle' : 'fa fa-times-circle'}
                  aria-hidden="true"
                />
                {' '}{item.status}
              </span>
              {item.href ? (
                <Button
                  href={item.href}
                  tone={item.action_label === 'Iniciar' ? 'success' : 'dark-blue'}
                  size="xs"
                  leftIconClass={item.action_label === 'Iniciar'
                    ? 'fa fa-play'
                    : item.action_label === 'Continuar'
                      ? 'fa fa-arrow-right'
                      : 'fa fa-eye'}
                  label={item.action_label}
                  title={actionLabel}
                  aria-label={actionLabel}
                />
              ) : null}
              {item.updated_at ? (
                <small className="studentStatusPanel__updated">
                  Atualizado em {item.updated_at}
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

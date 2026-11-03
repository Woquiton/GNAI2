import { useEffect, useId, useRef, type CSSProperties } from 'react';
import Button, { type ButtonTone } from '@/components/UI/Button/Button';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import { useDialogFocus } from '@/components/UI/Modal/useDialogFocus';
import { joinClassNames } from '@/utils/joinClassNames';
import { studentStatusStepDescriptions } from '../Students.constants';
import type { StudentStatusItem, StudentStatusPanelData } from '../Students.types';
import './StudentStatusSidebar.css';

interface StudentStatusSidebarProps {
    panel: StudentStatusPanelData;
    expanded: boolean;
    overlay: boolean;
    onToggle: () => void;
}

/** Ícone e tom das ações das etapas, nos mesmos padrões de Cadastrar, Editar e Visualizar. */
function stepAction(item: StudentStatusItem): { icon: string; tone: ButtonTone } {
    if (item.action_label === 'Iniciar') return { icon: 'fa fa-plus', tone: 'success' };
    if (item.action_label === 'Continuar') return { icon: 'fa fa-pencil', tone: 'warning' };

    return { icon: 'fa fa-eye', tone: 'dark-blue' };
}

function plural(count: number, singular: string, pluralForm: string): string {
    return `${count} ${count === 1 ? singular : pluralForm}`;
}

/**
 * Etapas do atendimento em uma lateral contextual: linha do tempo com as etapas e suas ações
 * quando aberta, e uma faixa estreita com os contadores quando recolhida.
 */
export default function StudentStatusSidebar({
    panel,
    expanded,
    overlay,
    onToggle,
}: StudentStatusSidebarProps): React.JSX.Element {
    const titleId = useId();
    const panelId = useId();
    const sidebarRef = useRef<HTMLElement | null>(null);
    const railButtonRef = useRef<HTMLButtonElement | null>(null);
    const collapseButtonRef = useRef<HTMLButtonElement | null>(null);
    const previousExpanded = useRef(expanded);
    const completedCount = panel.items.filter((item) => item.ok && !item.optional).length;
    const pendingCount = panel.items.filter((item) => !item.ok && !item.optional).length;
    const completedText = plural(completedCount, 'concluída', 'concluídas');
    const pendingText = plural(pendingCount, 'pendente', 'pendentes');
    const alertText = plural(panel.alerts.length, 'alerta', 'alertas');
    const railLabel = [
        'Expandir status do atendimento',
        completedText,
        pendingText,
        panel.alerts.length > 0 ? alertText : null,
    ]
        .filter(Boolean)
        .join(', ');
    const modal = overlay && expanded;

    useDialogFocus(sidebarRef, modal, '.studentStatusSidebar__panel .studentStatusSidebar__toggle');

    // A camada oculta fica inerte; ao alternar pelo teclado, o foco acompanha o botão visível.
    useEffect(() => {
        if (previousExpanded.current === expanded) return;
        previousExpanded.current = expanded;
        if (overlay) return;

        const focusWasInside =
            document.activeElement === document.body ||
            sidebarRef.current?.contains(document.activeElement);
        if (!focusWasInside) return;

        (expanded ? collapseButtonRef : railButtonRef).current?.focus({ preventScroll: true });
    }, [expanded, overlay]);

    useEffect(() => {
        if (!modal) return undefined;

        const previousOverflow = document.body.style.overflow;
        const closeOnEscape = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') onToggle();
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [modal, onToggle]);

    return (
        <aside
            ref={sidebarRef}
            className={joinClassNames(
                'studentStatusSidebar',
                expanded && 'studentStatusSidebar--expanded',
                modal && 'studentStatusSidebar--modal',
            )}
            aria-labelledby={titleId}
            aria-modal={modal || undefined}
            role={modal ? 'dialog' : undefined}
            tabIndex={modal ? -1 : undefined}
        >
            <div className="studentStatusSidebar__rail" inert={expanded}>
                <button
                    ref={railButtonRef}
                    type="button"
                    className="studentStatusSidebar__railButton"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    aria-label={railLabel}
                    title="Expandir status do atendimento"
                    onClick={onToggle}
                >
                    <span className="studentStatusSidebar__railHeader" aria-hidden="true">
                        <span className="studentStatusSidebar__toggle">
                            <i className="fa fa-chevron-left" />
                        </span>
                    </span>
                    <span className="studentStatusSidebar__railCounts" aria-hidden="true">
                        <span className="studentStatusSidebar__count studentStatusSidebar__count--ok">
                            {completedCount}
                        </span>
                        <span className="studentStatusSidebar__count studentStatusSidebar__count--pending">
                            {pendingCount}
                        </span>
                        {panel.alerts.length > 0 ? (
                            <i className="fa fa-exclamation-triangle studentStatusSidebar__railAlert" />
                        ) : null}
                    </span>
                    <span className="studentStatusSidebar__railSteps" aria-hidden="true">
                        {panel.items.map((item) => (
                            <span
                                key={item.key}
                                className={joinClassNames(
                                    'studentStatusSidebar__railDot',
                                    item.ok && 'studentStatusSidebar__railDot--ok',
                                    item.optional &&
                                        !item.ok &&
                                        'studentStatusSidebar__railDot--optional',
                                )}
                            />
                        ))}
                    </span>
                </button>
            </div>

            <div id={panelId} className="studentStatusSidebar__panel" inert={!expanded}>
                <header className="studentStatusSidebar__header">
                    <i
                        className="fa fa-list-alt studentStatusSidebar__headerIcon"
                        aria-hidden="true"
                    />
                    <div className="studentStatusSidebar__heading">
                        <h2 id={titleId} className="studentStatusSidebar__title">
                            Status do atendimento
                        </h2>
                        <p className="studentStatusSidebar__subtitle">
                            Acompanhe o progresso do atendimento do aluno.
                        </p>
                    </div>
                    <button
                        ref={collapseButtonRef}
                        type="button"
                        className="studentStatusSidebar__toggle"
                        aria-expanded={expanded}
                        aria-controls={panelId}
                        aria-label="Recolher status do atendimento"
                        title="Recolher status do atendimento"
                        onClick={onToggle}
                    >
                        <i className="fa fa-chevron-right" aria-hidden="true" />
                    </button>
                </header>

                <div className="studentStatusSidebar__body">
                    <p className="studentStatusSidebar__summary">
                        <span className="studentStatusSidebar__summaryItem studentStatusSidebar__summaryItem--ok">
                            <i className="fa fa-check-circle" aria-hidden="true" /> {completedText}
                        </span>
                        <span className="studentStatusSidebar__summaryItem studentStatusSidebar__summaryItem--pending">
                            <i className="fa fa-clock-o" aria-hidden="true" /> {pendingText}
                        </span>
                    </p>

                    <ol className="studentStatusSidebar__steps">
                        {panel.items.map((item, index) => {
                            const actionLabel = `${item.action_label} ${item.label}`;
                            const action = stepAction(item);
                            const description = studentStatusStepDescriptions[item.key];
                            const stepState = item.ok
                                ? 'ok'
                                : item.optional
                                  ? 'optional'
                                  : 'pending';
                            const statusIcon = item.ok
                                ? 'fa fa-check-circle'
                                : item.optional
                                  ? 'fa fa-minus-circle'
                                  : 'fa fa-clock-o';

                            return (
                                <li
                                    key={item.key}
                                    className={joinClassNames(
                                        'studentStatusSidebar__step',
                                        `studentStatusSidebar__step--${stepState}`,
                                    )}
                                    style={{ '--step-index': index } as CSSProperties}
                                >
                                    <span
                                        className="studentStatusSidebar__marker"
                                        aria-hidden="true"
                                    >
                                        {item.ok ? <i className="fa fa-check" /> : null}
                                    </span>
                                    <div className="studentStatusSidebar__card">
                                        <i
                                            className={joinClassNames(
                                                item.icon,
                                                'studentStatusSidebar__stepIcon',
                                            )}
                                            aria-hidden="true"
                                        />
                                        <div className="studentStatusSidebar__stepText">
                                            <h3 className="studentStatusSidebar__stepTitle">
                                                {item.label}
                                            </h3>
                                            {description ? (
                                                <p className="studentStatusSidebar__stepDescription">
                                                    {description}
                                                </p>
                                            ) : null}
                                            {item.updated_at ? (
                                                <small className="studentStatusSidebar__stepUpdated">
                                                    Atualizado em {item.updated_at}
                                                </small>
                                            ) : null}
                                        </div>
                                        <div className="studentStatusSidebar__stepAside">
                                            <span className="studentStatusSidebar__status">
                                                <i className={statusIcon} aria-hidden="true" />{' '}
                                                {item.status}
                                            </span>
                                            {item.href ? (
                                                <Button
                                                    href={item.href}
                                                    tone={action.tone}
                                                    size="xs"
                                                    iconOnly
                                                    leftIconClass={action.icon}
                                                    className="studentStatusSidebar__action"
                                                    title={item.action_label}
                                                    aria-label={actionLabel}
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>

                    {panel.alerts.length > 0 ? (
                        <div className="studentStatusSidebar__alerts">
                            {panel.alerts.map((alert) => (
                                <InlineAlert key={alert} variant="warning">
                                    <i className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
                                    {alert}
                                </InlineAlert>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </aside>
    );
}

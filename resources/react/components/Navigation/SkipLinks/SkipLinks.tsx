import { Link } from '@inertiajs/react';
import './SkipLinks.css';

export interface SkipLinkItem {
    label: string;
    /** Número da tecla de acesso (Alt + número no Chrome/Edge; Alt + Shift + número no Firefox). */
    accessKey: string;
    /** ID do elemento que recebe o foco. */
    targetId?: string;
    /** Página de destino, quando o atalho navega em vez de mover o foco. */
    href?: string;
    /** Preparação antes do foco, como abrir o menu lateral no celular. */
    onBeforeFocus?: () => void;
}

const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Foca o alvo de um atalho. Regiões de conteúdo recebem `tabindex="-1"` para que leitores de tela
 * comecem a leitura nelas; menus sem foco próprio enviam o foco ao primeiro item navegável.
 */
function focusTarget(targetId: string): void {
    const target = document.getElementById(targetId);

    if (!target) {
        return;
    }

    const focusable =
        target.matches(FOCUSABLE_SELECTOR) || target.hasAttribute('tabindex')
            ? target
            : target.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    const element = focusable ?? target;

    if (!focusable) {
        element.setAttribute('tabindex', '-1');
    }

    element.focus({ preventScroll: true });
    element.scrollIntoView({ block: 'start' });
}

/**
 * Barra de atalhos do eMAG/gov.br: aparece ao receber foco pelo Tab e leva direto ao conteúdo,
 * à página inicial, ao menu e ao rodapé. Deve ser o primeiro elemento focável da página.
 */
export default function SkipLinks({
    items,
    label = 'Atalhos de acessibilidade',
}: {
    items: SkipLinkItem[];
    label?: string;
}): React.JSX.Element {
    function activate(event: React.MouseEvent<HTMLAnchorElement>, item: SkipLinkItem): void {
        if (!item.targetId) {
            return;
        }

        event.preventDefault();
        const targetId = item.targetId;

        if (item.onBeforeFocus) {
            item.onBeforeFocus();
            // Aguarda a renderização que torna o alvo visível antes de mover o foco.
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => focusTarget(targetId));
            });
            return;
        }

        focusTarget(targetId);
    }

    return (
        <nav className="skipLinks" aria-label={label}>
            <ul className="skipLinks__list">
                {items.map((item) => {
                    const content = (
                        <>
                            <span className="skipLinks__label">{item.label}</span>
                            <span className="skipLinks__key" aria-hidden="true">
                                {item.accessKey}
                            </span>
                        </>
                    );

                    return (
                        <li key={item.accessKey}>
                            {item.href && !item.targetId ? (
                                <Link
                                    href={item.href}
                                    className="skipLinks__link"
                                    accessKey={item.accessKey}
                                    title={`${item.label} (tecla de acesso ${item.accessKey})`}
                                >
                                    {content}
                                </Link>
                            ) : (
                                <a
                                    href={`#${item.targetId ?? ''}`}
                                    className="skipLinks__link"
                                    accessKey={item.accessKey}
                                    title={`Ir para ${item.label.toLowerCase()} (tecla de acesso ${item.accessKey})`}
                                    onClick={(event) => activate(event, item)}
                                >
                                    {content}
                                </a>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const GAP = 4;
const EDGE = 8;

/**
 * Botão "⋮" que abre uma caixinha com as ações da linha, usado quando a listagem fica estreita
 * (celular). Padrão de divulgação: o gatilho informa `aria-expanded`, o primeiro item recebe o
 * foco, Esc ou clique fora fecham e o foco volta ao gatilho. A caixinha vai para o `body` porque
 * a moldura da tabela corta o que transborda.
 */
export default function TableListRowActionsMenu({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}): React.JSX.Element {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState<{ top: number; right: number } | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const panelId = useId();

    function close(returnFocus: boolean): void {
        setOpen(false);
        setPosition(null);
        if (returnFocus) triggerRef.current?.focus();
    }

    // Fecha só depois da ação do item. Precisa ser o onClick do React, que borbulha após o do
    // item: um listener nativo no painel desmontaria a caixinha (microtarefa entre listeners)
    // antes de o React despachar o clique, e a ação (abrir o modal de exclusão) se perderia. O
    // foco volta ao gatilho; um modal aberto pela ação o devolve para ele ao fechar.
    function closeAfterAction(event: React.MouseEvent<HTMLDivElement>): void {
        if ((event.target as HTMLElement).closest('a, button')) close(true);
    }

    // Abaixo do gatilho, alinhado à direita; sobe quando não cabe na tela.
    useLayoutEffect(() => {
        const trigger = triggerRef.current;
        const panel = panelRef.current;
        if (!open || !trigger || !panel) return;

        const rect = trigger.getBoundingClientRect();
        const below = rect.bottom + GAP;
        const top =
            below + panel.offsetHeight > window.innerHeight - EDGE
                ? Math.max(EDGE, rect.top - GAP - panel.offsetHeight)
                : below;

        setPosition({ top, right: Math.max(EDGE, window.innerWidth - rect.right) });
    }, [open]);

    // Só depois de posicionada a caixinha fica visível e pode receber o foco.
    useEffect(() => {
        if (position) {
            panelRef.current?.querySelector<HTMLElement>('a[href], button:not(:disabled)')?.focus();
        }
    }, [position]);

    useEffect(() => {
        if (!open) return undefined;

        function outside(event: MouseEvent): void {
            const target = event.target as Node;
            if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
                close(false);
            }
        }
        // Rolagem ou redimensionamento deixariam a caixinha longe do gatilho.
        function dismiss(event: Event): void {
            if (event.type === 'scroll' && panelRef.current?.contains(event.target as Node)) {
                return;
            }
            close(false);
        }

        function keydown(event: KeyboardEvent): void {
            if (event.key === 'Escape') {
                event.stopPropagation();
                close(true);
            }
        }
        // Tab para fora da caixinha a fecha.
        function focusout(event: FocusEvent): void {
            const next = event.relatedTarget as Node | null;
            if (next && !panelRef.current?.contains(next) && next !== triggerRef.current) {
                close(false);
            }
        }
        const panel = panelRef.current;
        document.addEventListener('mousedown', outside);
        window.addEventListener('scroll', dismiss, true);
        window.addEventListener('resize', dismiss);
        panel?.addEventListener('keydown', keydown);
        panel?.addEventListener('focusout', focusout);

        return () => {
            document.removeEventListener('mousedown', outside);
            window.removeEventListener('scroll', dismiss, true);
            window.removeEventListener('resize', dismiss);
            panel?.removeEventListener('keydown', keydown);
            panel?.removeEventListener('focusout', focusout);
        };
    }, [open]);

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                className="tableRowActions__trigger"
                aria-label={label}
                title={label}
                aria-expanded={open}
                aria-controls={open ? panelId : undefined}
                onClick={() => (open ? close(false) : setOpen(true))}
            >
                <i className="fa fa-ellipsis-v" aria-hidden="true" />
            </button>
            {open
                ? createPortal(
                      <div
                          ref={panelRef}
                          id={panelId}
                          className="tableRowActions__menu"
                          role="group"
                          aria-label={label}
                          onClick={closeAfterAction}
                          style={
                              position
                                  ? { top: position.top, right: position.right }
                                  : { visibility: 'hidden' }
                          }
                      >
                          {children}
                      </div>,
                      document.body,
                  )
                : null}
        </>
    );
}

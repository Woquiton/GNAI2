import { Children } from 'react';
import TableActions from '@/components/Tables/TableActions/TableActions';
import Button from '@/components/UI/Button/Button';

interface RowLinkAction {
    href: string;
    /** Nome acessível, por exemplo "Visualizar Cadeira de rodas". */
    label: string;
    /** Abre em outra aba (arquivos, PDFs, cadastros relacionados). */
    newTab?: boolean;
}

interface RowDownloadAction {
    href: string;
    label: string;
    /** Nome sugerido do arquivo; `true` mantém o nome enviado pelo servidor. */
    fileName?: string | true;
}

interface RowButtonAction {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

interface TableListRowActionsProps {
    view?: RowLinkAction | false;
    edit?: RowLinkAction | false;
    download?: RowDownloadAction | false;
    remove?: RowButtonAction | false;
    /** Ações adicionais do domínio, exibidas antes da exclusão. */
    children?: React.ReactNode;
    emptyLabel?: string;
}

/**
 * Ações compactas da última coluna das listagens: visualizar, editar e excluir com os tons e
 * ícones do Gnai. Passe `false` para ocultar uma ação sem permissão.
 */
export default function TableListRowActions({
    view,
    edit,
    download,
    remove,
    children,
    emptyLabel = 'Nenhuma ação',
}: TableListRowActionsProps): React.JSX.Element {
    const hasActions = Boolean(
        view || edit || download || remove || Children.toArray(children).length,
    );
    const newTab = { target: '_blank', rel: 'noopener noreferrer' } as const;

    return (
        <TableActions>
            {view ? (
                <Button
                    href={view.href}
                    {...(view.newTab ? newTab : {})}
                    size="sm"
                    tone="dark-blue"
                    iconOnly
                    leftIconClass="fa fa-eye"
                    aria-label={view.label}
                />
            ) : null}
            {edit ? (
                <Button
                    href={edit.href}
                    {...(edit.newTab ? newTab : {})}
                    size="sm"
                    tone="warning"
                    iconOnly
                    leftIconClass="fa fa-pencil"
                    aria-label={edit.label}
                />
            ) : null}
            {download ? (
                <Button
                    href={download.href}
                    download={download.fileName ?? true}
                    size="sm"
                    tone="cancel"
                    iconOnly
                    leftIconClass="fa fa-download"
                    aria-label={download.label}
                />
            ) : null}
            {children}
            {remove ? (
                <Button
                    size="sm"
                    tone="dark-red"
                    iconOnly
                    leftIconClass="fa fa-trash-o"
                    disabled={remove.disabled}
                    aria-label={remove.label}
                    onClick={remove.onClick}
                />
            ) : null}
            {!hasActions ? <span>{emptyLabel}</span> : null}
        </TableActions>
    );
}

import { TableListCreateButton } from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import { sessionUrls } from '../Sessions.routes';

interface SessionWorkspaceShortcut {
    href: string;
    label: string;
    title: string;
    iconClass: string;
}

interface SessionWorkspaceActionsProps {
    /** Atalho para a outra agenda (central ou "Meus agendamentos"), quando permitido. */
    shortcut?: SessionWorkspaceShortcut | false;
    canCreate: boolean;
}

/** Ações do cabeçalho das agendas: atalho entre as visões e cadastro de agendamento. */
export default function SessionWorkspaceActions({
    shortcut,
    canCreate,
}: SessionWorkspaceActionsProps): React.JSX.Element {
    return (
        <>
            {shortcut ? (
                <Button
                    href={shortcut.href}
                    tone="inverse"
                    leftIconClass={shortcut.iconClass}
                    label={shortcut.label}
                    title={shortcut.title}
                />
            ) : null}
            {canCreate ? (
                <TableListCreateButton
                    href={sessionUrls.create}
                    ariaLabel="Cadastrar agendamento"
                />
            ) : null}
        </>
    );
}

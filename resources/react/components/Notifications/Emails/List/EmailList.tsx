import {
    TableListFooter,
    TableListScroll,
    TableListTable,
} from '@/components/Tables/TableList/TableList';
import type { EmailPaginator, EmailRecord } from '../Emails.types';
import { emailColumns } from './emailColumns';

interface EmailListProps {
    emails: EmailPaginator;
    loading: boolean;
    onPageSelect: (page: number) => void;
    selected: string[];
    onSelect: (id: string, checked: boolean) => void;
    onStar: (email: EmailRecord) => void;
    processing: boolean;
    canSend: boolean;
}

export default function EmailList({
    emails,
    loading,
    onPageSelect,
    selected,
    onSelect,
    onStar,
    processing,
    canSend,
}: EmailListProps): React.JSX.Element {
    return (
        <>
            <TableListScroll aria-label="Tabela de e-mails">
                <TableListTable
                    columns={emailColumns({ selected, onSelect, onStar, processing, canSend })}
                    rows={emails.data}
                    rowKey={(email) => email.id}
                    page={emails}
                    rowClassName={(email) => (!email.is_read ? 'emailInbox__unread' : undefined)}
                    className="emailInbox__table"
                    emptyMessage="Nenhum e-mail encontrado nesta pasta com os filtros selecionados."
                />
            </TableListScroll>
            <TableListFooter
                page={emails}
                disabled={loading}
                paginationLabel="Páginas de e-mails"
                onSelect={onPageSelect}
            />
        </>
    );
}

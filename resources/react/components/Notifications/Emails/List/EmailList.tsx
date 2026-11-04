import {
    TableListFooter,
    TableListScroll,
    TableListTable,
} from '@/components/Tables/TableList/TableList';
import type { EmailPaginator } from '../Emails.types';
import { emailColumns } from './emailColumns';

interface EmailListProps {
    emails: EmailPaginator;
    loading: boolean;
    onPageSelect: (page: number) => void;
}

export default function EmailList({
    emails,
    loading,
    onPageSelect,
}: EmailListProps): React.JSX.Element {
    return (
        <>
            <TableListScroll aria-label="Tabela de e-mails">
                <TableListTable
                    columns={emailColumns}
                    rows={emails.data}
                    rowKey={(email) => email.id}
                    page={emails}
                    emptyMessage="Nenhum envio encontrado para os filtros selecionados."
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

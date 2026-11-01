import { useMemo } from 'react';
import { TableListFooter, TableListRowActions, TableListScroll, TableListTable, type TableListColumn } from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import type { NotificationPaginator, NotificationRecord } from '../Notifications.types';
import { notificationColumns } from './notificationColumns';
import './NotificationList.css';

interface NotificationListProps {
    notifications: NotificationPaginator;
    loading: boolean;
    processing: boolean;
    onRead: (notification: NotificationRecord) => void;
    onPageSelect: (page: number) => void;
}

/** Abrir o destino e marcar como lida; sem destino e já lida, a linha fica "Sem ações". */
function NotificationRowActions({
    notification,
    processing,
    onRead,
}: {
    notification: NotificationRecord;
    processing: boolean;
    onRead: (notification: NotificationRecord) => void;
}): React.JSX.Element {
    const actions =
        notification.url || notification.is_unread ? (
            <>
                {notification.url ? (
                    <Button
                        href={notification.url}
                        size="sm"
                        tone="save"
                        iconOnly
                        leftIconClass="fa fa-arrow-right"
                        title="Abrir"
                        aria-label={`Abrir ${notification.title}`}
                    />
                ) : null}
                {notification.is_unread ? (
                    <Button
                        type="button"
                        size="sm"
                        tone="success"
                        iconOnly
                        leftIconClass="fa fa-check"
                        title="Marcar como lida"
                        aria-label={`Marcar como lida: ${notification.title}`}
                        disabled={processing}
                        onClick={() => onRead(notification)}
                    />
                ) : null}
            </>
        ) : undefined;

    return <TableListRowActions emptyLabel="Sem ações">{actions}</TableListRowActions>;
}

export default function NotificationList({
    notifications,
    loading,
    processing,
    onRead,
    onPageSelect,
}: NotificationListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<NotificationRecord>[]>(
        () => [
            ...notificationColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '11%',
                fixed: 'end',
                render: (notification) => (
                    <NotificationRowActions
                        notification={notification}
                        processing={processing}
                        onRead={onRead}
                    />
                ),
            },
        ],
        [processing, onRead],
    );
    const emptyMessage = (
        <>
            <i className="fa fa-bell-o notificationList__emptyIcon" aria-hidden="true" />
            Nenhuma notificação encontrada
        </>
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de notificações">
                <TableListTable
                    className="notificationList"
                    columns={columns}
                    rows={notifications.data}
                    rowKey={(notification) => notification.id}
                    page={notifications}
                    emptyMessage={emptyMessage}
                />
            </TableListScroll>
            <TableListFooter
                page={notifications}
                disabled={loading}
                paginationLabel="Paginação de notificações"
                onSelect={onPageSelect}
            />
        </>
    );
}

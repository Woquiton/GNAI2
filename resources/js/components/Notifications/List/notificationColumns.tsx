import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { NotificationRecord } from '../Notifications.types';
import '@styles/components/Notifications/List/NotificationList.css';

const NOT_INFORMED = 'Não informado';

/** Título com o ícone da seção da sidebar à qual a notificação leva, como no topo. */
function NotificationTitle({
    notification,
}: {
    notification: NotificationRecord;
}): React.JSX.Element {
    return (
        <span className="notificationList__title" title={notification.title}>
            <i className={`${notification.icon_class} notificationList__icon`} aria-hidden="true" />
            <span className="notificationList__titleText">{notification.title}</span>
        </span>
    );
}

function receivedAt(notification: NotificationRecord): React.ReactNode {
    if (!notification.created_at) {
        return NOT_INFORMED;
    }

    return (
        <time dateTime={notification.created_at}>
            <i className="fa fa-clock-o notificationList__clock" aria-hidden="true" />
            {notification.created_at_human}
        </time>
    );
}

/** Colunas de dados da listagem de notificações. */
export const notificationColumns: TableListColumn<NotificationRecord>[] = [
    {
        id: 'title',
        label: 'Notificação',
        width: '26%',
        fixed: 'start',
        render: (notification) => <NotificationTitle notification={notification} />,
    },
    {
        id: 'message',
        label: 'Mensagem',
        width: '38%',
        render: (notification) => (
            <span title={notification.message || undefined}>
                {notification.message || NOT_INFORMED}
            </span>
        ),
    },
    { id: 'date', label: 'Recebida', width: '14%', render: receivedAt },
    {
        id: 'status',
        label: 'Status',
        width: '11%',
        render: (notification) => (
            <TableLabel tone={notification.is_unread ? 'purple' : 'inverse'}>
                {notification.is_unread ? 'Não lida' : 'Lida'}
            </TableLabel>
        ),
    },
];

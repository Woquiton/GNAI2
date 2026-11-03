import NotificationList from '@/components/Notifications/List/NotificationList';
import { notificationListTour } from '@/components/Notifications/notificationTours';
import {
    notificationBreadcrumb,
    notificationUrls,
} from '@/components/Notifications/Notifications.routes';
import type {
    NotificationRecord,
    NotificationsIndexProps,
} from '@/components/Notifications/Notifications.types';
import {
    TableListLayout,
    useTableListAction,
    useTableListVisit,
} from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';

export default function NotificationsIndexPage({
    notifications,
}: NotificationsIndexProps): React.JSX.Element {
    const list = useTableListVisit({
        url: notificationUrls.index,
        failureText: 'Não foi possível atualizar as notificações. Tente novamente.',
    });
    const readAll = useTableListAction<never>({
        failureText: 'Não foi possível marcar as notificações como lidas. Tente novamente.',
    });
    const readOne = useTableListAction<never>({
        failureText: 'Não foi possível marcar a notificação como lida. Tente novamente.',
    });
    const processing = readAll.processing || readOne.processing;

    function markAllAsRead(): void {
        if (!processing) {
            readAll.submit('post', notificationUrls.readAll);
        }
    }

    function markAsRead(notification: NotificationRecord): void {
        if (!processing) {
            readOne.submit('post', notificationUrls.read(notification.id));
        }
    }

    return (
        <TableListLayout
            title="Notificações"
            subtitle="Histórico completo das suas notificações do sistema."
            breadcrumbItems={notificationBreadcrumb()}
            actions={
                <Button
                    type="button"
                    tone="list-action"
                    labelIconClass="fa fa-check"
                    disabled={processing}
                    onClick={markAllAsRead}
                >
                    Marcar todas como lidas
                </Button>
            }
            listLabel="Listagem de notificações"
            loading={list.loading}
            loadingLabel="Atualizando notificações"
            tour={notificationListTour}
        >
            <NotificationList
                notifications={notifications}
                loading={list.loading}
                processing={processing}
                onRead={markAsRead}
                onPageSelect={(page) => list.visit({}, page)}
            />
        </TableListLayout>
    );
}

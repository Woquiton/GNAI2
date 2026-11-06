export interface NotificationRecord {
    id: string;
    title: string;
    /** Ícone da seção da sidebar à qual a notificação leva. */
    icon_class: string;
    message: string;
    url: string | null;
    is_unread: boolean;
    created_at: string | null;
    created_at_human: string | null;
}

export interface NotificationPaginator {
    data: NotificationRecord[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

export interface NotificationsIndexProps {
    notifications: NotificationPaginator;
}

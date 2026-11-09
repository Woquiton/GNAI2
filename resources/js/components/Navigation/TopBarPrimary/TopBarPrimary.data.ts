export interface NotificationItem {
    href?: string;
    iconClass: string;
    title: string;
    description: string;
}

export interface ProfileLink {
    href?: string;
    onSelect?: () => void;
    method?: 'get' | 'post';
    iconClass: string;
    label: string;
}

export interface ContactItem {
    avatar: string;
    name: string;
    status: 'online' | 'away' | 'offline';
}

export const contacts: ContactItem[] = [];

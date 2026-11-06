export interface BackupRecord {
    id: number;
    file_name: string;
    file_path: string;
    size: string;
    status: 'success' | 'failed' | 'archived' | null;
    created_at: string;
    updated_at: string | null;
    created_at_label: string;
    user: { name: string } | null;
}

export interface BackupPaginator {
    data: BackupRecord[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface BackupFilters {
    [key: string]: string;
    name: string;
    status: string;
    user_id: string;
}

export interface BackupUser {
    id: number;
    name: string;
}

export interface BackupListPermissions {
    store: boolean;
    upload: boolean;
    show: boolean;
    download: boolean;
    restore: boolean;
    destroy: boolean;
}

export interface BackupIndexProps {
    backups: BackupPaginator;
    users: BackupUser[];
    filters: Partial<BackupFilters>;
    backupDirectory: string;
    can: BackupListPermissions;
}

export interface BackupShowProps {
    backup: BackupRecord;
    can: { download: boolean; destroy: boolean };
}

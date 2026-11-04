export type SettingsOptions = Record<string, string>;

export interface MailSettingsProps {
    configured: boolean;
    mail: {
        transport: string;
        host: string | null;
        port: number | null;
        encryption: string;
        username: string | null;
        from_address: string;
        from_name: string;
        has_password: boolean;
        has_application_key: boolean;
        test_status: 'success' | 'failed' | null;
        last_tested_at: string | null;
        gmail_bounces_enabled: boolean;
        gmail_bounces_folder: string;
        gmail_inbox_enabled: boolean;
        gmail_inbox_folder: string;
        gmail_folders_enabled: boolean;
    };
    transports: SettingsOptions;
    encryptions: SettingsOptions;
    canUpdate: boolean;
    gmailBouncesAvailable: boolean;
    gmailFoldersAvailable: boolean;
}

export interface BackupSettingsValues {
    retention_mode: string;
    retention_value: number;
    times: string[];
}

export interface BackupSettingsProps {
    backup: BackupSettingsValues;
    defaults: BackupSettingsValues;
    retentionModes: SettingsOptions;
    timezone: string;
    canUpdate: boolean;
}

export interface TeacherAccessSettingsProps {
    domains: string[];
    canUpdate: boolean;
}

export interface PdfHeaderSettingsProps {
    pdfHeader: {
        institution_name: string;
        issuing_unit: string | null;
        details: string | null;
        logo_url: string | null;
        logo_shape: string;
    };
    logoShapes: SettingsOptions;
    canUpdate: boolean;
}

export interface SessionSecuritySettingsProps {
    sessionSecuritySettings: {
        lock_after: number;
        logout_after: number;
    };
    canUpdate: boolean;
}

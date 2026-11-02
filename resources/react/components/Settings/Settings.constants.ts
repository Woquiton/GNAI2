import { settingsUrls } from './Settings.routes';

/** Categorias exibidas nas abas; novas categorias entram nesta lista, cada uma com sua página. */
export const settingsCategories = [
    {
        key: 'mail',
        component: 'Settings/Mail',
        label: 'E-mail',
        href: settingsUrls.mail,
        iconClass: 'fa fa-envelope',
    },
    {
        key: 'backup',
        component: 'Settings/Backup',
        label: 'Backups',
        href: settingsUrls.backup,
        iconClass: 'fa fa-database',
    },
    {
        key: 'teacher-access',
        component: 'Settings/TeacherAccess',
        label: 'Acesso dos professores',
        href: settingsUrls.teacherAccess,
        iconClass: 'fa fa-graduation-cap',
    },
    {
        key: 'pdf',
        component: 'Settings/Pdf',
        label: 'PDFs',
        href: settingsUrls.pdf,
        iconClass: 'fa fa-file-pdf-o',
    },
] as const;

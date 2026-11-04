import { emailDeliveryIcons } from '@/components/UI/EmailDeliveryIndicator/EmailDeliveryIndicator.data';
import { EMAIL_TOUR_TARGETS } from '../emailTours';
import type { EmailIndexProps } from '../Emails.types';

interface EmailFoldersProps {
    counts: EmailIndexProps['counts'];
    statusOptions: EmailIndexProps['statusOptions'];
    status: string;
    onSelect: (status: string) => void;
}

export default function EmailFolders({
    counts,
    statusOptions,
    status,
    onSelect,
}: EmailFoldersProps): React.JSX.Element {
    const folders = [
        { value: '', label: 'Todos os envios', icon: 'fa fa-inbox', count: counts.all ?? 0 },
        ...Object.entries(statusOptions).map(([value, label]) => ({
            value,
            label,
            icon: emailDeliveryIcons[value as keyof typeof statusOptions],
            count: counts[value] ?? 0,
        })),
    ];

    return (
        <aside className="emailInbox__sidebar" data-tour={EMAIL_TOUR_TARGETS.folders}>
            <h2 className="emailInbox__folderTitle">Envios</h2>
            <nav aria-label="Filtrar e-mails por status" className="emailInbox__folders">
                {folders.map((folder) => (
                    <button
                        key={folder.value}
                        type="button"
                        className={status === folder.value ? 'is-active' : undefined}
                        aria-label={`${folder.label}: ${folder.count} envios`}
                        aria-pressed={status === folder.value}
                        onClick={() => onSelect(folder.value)}
                    >
                        <i className={folder.icon} aria-hidden="true" />
                        <span>{folder.label}</span>
                        <span className="emailInbox__folderCount">{folder.count}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}

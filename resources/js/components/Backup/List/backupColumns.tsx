import { Link } from '@inertiajs/react';
import { formatTableListDate, type TableListColumn } from '@/components/Tables/TableList/TableList';
import { backupUrls } from '../Backup.routes';
import type { BackupRecord } from '../Backup.types';
import BackupStatusLabel from '../BackupStatusLabel';
import '@styles/components/Backup/List/BackupList.css';

function BackupFileName({
    backup,
    linked,
}: {
    backup: BackupRecord;
    linked: boolean;
}): React.JSX.Element {
    const content = (
        <>
            <i className="fa fa-file-archive-o" aria-hidden="true" />
            <span>{backup.file_name}</span>
        </>
    );

    if (linked) {
        return (
            <Link className="backupList__file" href={backupUrls.show(backup.id)}>
                {content}
            </Link>
        );
    }

    return <span className="backupList__file">{content}</span>;
}

/**
 * Colunas de dados da listagem; o nome do arquivo vira link para a visualização quando o usuário
 * pode abri-la. As complementares começam ocultas no seletor de colunas.
 */
export function backupColumns(canShow: boolean): TableListColumn<BackupRecord>[] {
    return [
        {
            id: 'file',
            label: 'Arquivo ZIP',
            width: '27%',
            fixed: 'start',
            render: (backup) => <BackupFileName backup={backup} linked={canShow} />,
        },
        {
            id: 'status',
            label: 'Status',
            width: '12%',
            render: (backup) => <BackupStatusLabel status={backup.status} />,
        },
        { id: 'size', label: 'Tamanho', width: '11%', render: (backup) => backup.size },
        {
            id: 'created',
            label: 'Criado em',
            width: '18%',
            render: (backup) => backup.created_at_label,
        },
        {
            id: 'user',
            label: 'Responsável',
            width: '14%',
            render: (backup) => backup.user?.name ?? 'Sistema',
        },
        {
            id: 'path',
            label: 'Caminho do arquivo',
            width: '16%',
            defaultVisible: false,
            render: (backup) => backup.file_path || 'Não informado',
        },
        {
            id: 'updated',
            label: 'Atualizado em',
            width: '16%',
            defaultVisible: false,
            render: (backup) => formatTableListDate(backup.updated_at, true),
        },
    ];
}

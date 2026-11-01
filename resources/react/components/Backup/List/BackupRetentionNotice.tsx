import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import './BackupList.css';

/** Política de armazenamento exibida abaixo do histórico de backups. */
export default function BackupRetentionNotice({
    backupDirectory,
}: {
    backupDirectory: string;
}): React.JSX.Element {
    return (
        <InlineAlert variant="info" className="backupList__retention">
            <i className="fa fa-shield" aria-hidden="true" />{' '}
            <strong>Política de Armazenamento.</strong> Os backups são armazenados em{' '}
            <code>storage/app/private/{backupDirectory}</code>. O sistema mantém os 30 registros
            mais recentes; os excedentes são removidos automaticamente com seus arquivos físicos.
        </InlineAlert>
    );
}

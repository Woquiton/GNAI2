import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import type { BackupRecord } from '../Backup.types';
import { BACKUP_TOUR_TARGETS } from '../backupTours';
import BackupStatusLabel from '../BackupStatusLabel';
import './BackupDetails.css';

/** Informações técnicas e metadados de um backup. */
export default function BackupDetails({ backup }: { backup: BackupRecord }): React.JSX.Element {
    return (
        <CardBox>
            <FormSection
                id="backup-information"
                title="Informações do Backup"
                variant="inline"
                iconClass="fa fa-file-archive-o"
                tourTarget={BACKUP_TOUR_TARGETS.details}
            >
                <DetailGrid columns={3}>
                    <DetailField label="Arquivo ZIP">{backup.file_name}</DetailField>
                    <DetailField label="Caminho no Servidor">
                        <code className="backupDetails__path">{backup.file_path}</code>
                    </DetailField>
                    <DetailField label="Nome de Exibição (Alias)">{backup.file_name}</DetailField>
                    <DetailField label="Tamanho do Arquivo">{backup.size}</DetailField>
                    <DetailField label="Data de Geração">{backup.created_at_label}</DetailField>
                    <DetailField label="Responsável">{backup.user?.name ?? 'Sistema'}</DetailField>
                    <DetailField label="Status do Backup">
                        <BackupStatusLabel status={backup.status} />
                    </DetailField>
                    <DetailField label="ID do Registro">#{backup.id}</DetailField>
                    <DetailField label="Regra de Retenção" wide>
                        O sistema mantém os 30 registros de backup mais recentes. Registros
                        excedentes podem ser removidos automaticamente com seus arquivos físicos.
                    </DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}

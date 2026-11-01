import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { aeeRecordUrls, aeeSessionUrls } from '../AeeRecords.routes';
import type { AeeRecordManagementPermissions } from '../AeeRecords.types';

interface AeeRecordDetailsActionsProps {
    recordId: number;
    sessionId: number;
    permissions: AeeRecordManagementPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé do registro: PDF à esquerda; voltar ao agendamento, editar e excluir ao centro. */
export default function AeeRecordDetailsActions({
    recordId,
    sessionId,
    permissions,
    deleting,
    onDelete,
}: AeeRecordDetailsActionsProps): React.JSX.Element {
    const pdfAction = (
        <Button
            href={aeeRecordUrls.pdf(recordId)}
            target="_blank"
            rel="noopener noreferrer"
            tone="dark-red"
            leftIconClass="fa fa-file-pdf-o"
            label="PDF"
            title="Exportar registro do atendimento AEE em PDF"
            aria-label="Exportar registro do atendimento AEE em PDF"
        />
    );

    return (
        <FormActions
            secondary={pdfAction}
            status={deleting ? 'Excluindo registro do atendimento AEE...' : undefined}
        >
            <Button
                href={aeeSessionUrls.show(sessionId)}
                tone="cancel"
                label="Voltar"
                title="Voltar para o agendamento"
                aria-label="Voltar para o agendamento"
                disabled={deleting}
            />
            {permissions.update ? (
                <Button
                    href={aeeRecordUrls.edit(recordId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar registro do atendimento AEE"
                    aria-label="Editar registro do atendimento AEE"
                    disabled={deleting}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir registro do atendimento AEE"
                    aria-label="Excluir registro do atendimento AEE"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

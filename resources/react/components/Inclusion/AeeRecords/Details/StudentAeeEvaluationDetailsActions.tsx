import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { aeeRecordUrls, studentAeeRecordUrls } from '../AeeRecords.routes';
import type { AeeRecordManagementPermissions } from '../AeeRecords.types';

interface StudentAeeEvaluationDetailsActionsProps {
    studentId: number;
    evaluationId: number;
    recordId: number;
    permissions: AeeRecordManagementPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/**
 * Rodapé da avaliação do aluno: PDF e registro completo à esquerda; voltar ao prontuário, editar
 * e excluir ao centro.
 */
export default function StudentAeeEvaluationDetailsActions({
    studentId,
    evaluationId,
    recordId,
    permissions,
    deleting,
    onDelete,
}: StudentAeeEvaluationDetailsActionsProps): React.JSX.Element {
    const urls = studentAeeRecordUrls(studentId);
    const secondaryActions = (
        <>
            <Button
                href={urls.pdf(evaluationId)}
                target="_blank"
                rel="noopener noreferrer"
                tone="dark-red"
                leftIconClass="fa fa-file-pdf-o"
                label="PDF"
                title="Exportar registro do aluno em PDF"
                aria-label="Exportar registro do aluno em PDF"
            />
            <Button
                href={aeeRecordUrls.show(recordId)}
                tone="info"
                leftIconClass="fa fa-clone"
                label="Ver registro completo"
                title="Ver registro completo do atendimento AEE"
                aria-label="Ver registro completo do atendimento AEE"
                disabled={deleting}
            />
        </>
    );

    return (
        <FormActions
            secondary={secondaryActions}
            status={deleting ? 'Excluindo registro do aluno...' : undefined}
        >
            <Button
                href={urls.record}
                tone="cancel"
                label="Voltar"
                title="Voltar para o prontuário do aluno"
                aria-label="Voltar para o prontuário do aluno"
                disabled={deleting}
            />
            {permissions.update ? (
                <Button
                    href={urls.edit(evaluationId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar avaliação do aluno"
                    aria-label="Editar avaliação do aluno"
                    disabled={deleting}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir registro do aluno neste atendimento AEE"
                    aria-label="Excluir registro do aluno neste atendimento AEE"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

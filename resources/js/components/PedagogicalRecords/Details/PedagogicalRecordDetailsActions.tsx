import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { pedagogicalRecordReturnUrl, pedagogicalRecordUrls } from '../PedagogicalRecords.routes';
import type { PedagogicalRecordShowAbilities } from '../PedagogicalRecords.types';
import { PEDAGOGICAL_RECORD_TOUR_TARGETS } from '../pedagogicalRecordTours';

interface PedagogicalRecordDetailsActionsProps {
    recordId: number;
    sessionId: number;
    /** Aluno de origem: voltar e editar retornam ao prontuário. */
    studentId?: number;
    permissions: PedagogicalRecordShowAbilities;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: PDF à esquerda; voltar, editar e excluir ao centro. */
export default function PedagogicalRecordDetailsActions({
    recordId,
    sessionId,
    studentId,
    permissions,
    deleting,
    onDelete,
}: PedagogicalRecordDetailsActionsProps): React.JSX.Element {
    const backLabel = studentId ? 'Voltar para o prontuário do aluno' : 'Voltar para o agendamento';
    const pdfAction = permissions.pdf ? (
        <Button
            href={pedagogicalRecordUrls.pdf(recordId)}
            target="_blank"
            rel="noopener noreferrer"
            tone="dark-red"
            leftIconClass="fa fa-file-pdf-o"
            label="PDF"
            title="Exportar atendimento pedagógico em PDF"
            aria-label="Exportar atendimento pedagógico em PDF"
        />
    ) : undefined;

    return (
        <FormActions
            secondary={pdfAction}
            tourTarget={PEDAGOGICAL_RECORD_TOUR_TARGETS.detailsActions}
        >
            <Button
                href={pedagogicalRecordReturnUrl(sessionId, studentId)}
                tone="cancel"
                label="Voltar"
                title={backLabel}
                aria-label={backLabel}
                disabled={deleting}
            />
            {permissions.update ? (
                <Button
                    href={pedagogicalRecordUrls.edit(recordId, studentId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar atendimento pedagógico"
                    aria-label="Editar atendimento pedagógico"
                    disabled={deleting}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir atendimento pedagógico"
                    aria-label="Excluir atendimento pedagógico"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

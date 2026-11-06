import FormActions from '@/components/Forms/FormActions/FormActions';
import StudentRecordReturnButton from '@/components/Students/StudentRecordReturnButton';
import Button from '@/components/UI/Button/Button';
import { paeeUrls, studentPaeesTab } from '../Paees.routes';
import type { PaeeShowPermissions } from '../Paees.types';
import { PAEE_TOUR_TARGETS } from '../paeeTours';

interface PaeeDetailsActionsProps {
    paeeId: number;
    studentId: number;
    permissions: PaeeShowPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: PDF à esquerda; voltar, editar e excluir ao centro. */
export default function PaeeDetailsActions({
    paeeId,
    studentId,
    permissions,
    deleting,
    onDelete,
}: PaeeDetailsActionsProps): React.JSX.Element {
    const pdfAction = (
        <Button
            href={paeeUrls.pdf(paeeId)}
            target="_blank"
            rel="noopener noreferrer"
            tone="dark-red"
            leftIconClass="fa fa-file-pdf-o"
            label="PDF"
            title="Gerar PDF do PAEE"
            aria-label="Gerar PDF do PAEE"
        />
    );

    return (
        <FormActions secondary={pdfAction} tourTarget={PAEE_TOUR_TARGETS.detailsActions}>
            <StudentRecordReturnButton studentId={studentId} tab={studentPaeesTab} />
            {permissions.update ? (
                <Button
                    href={paeeUrls.edit(paeeId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    aria-label="Editar PAEE"
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    type="button"
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    aria-label="Excluir PAEE"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

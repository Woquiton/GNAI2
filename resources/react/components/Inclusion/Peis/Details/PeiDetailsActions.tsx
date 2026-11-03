import FormActions from '@/components/Forms/FormActions/FormActions';
import StudentRecordReturnButton from '@/components/Inclusion/Students/StudentRecordReturnButton';
import Button from '@/components/UI/Button/Button';
import PeiConfirmAction from '../PeiConfirmAction';
import { peiUrls } from '../Peis.routes';
import type { PeiShowPermissions } from '../Peis.types';
import { PEI_TOUR_TARGETS } from '../peiTours';

interface PeiDetailsActionsProps {
    peiId: number;
    studentId: number;
    permissions: PeiShowPermissions;
}

/** Rodapé fixo do PEI: PDFs à esquerda; voltar, finalizar e excluir ao centro. */
export default function PeiDetailsActions({
    peiId,
    studentId,
    permissions,
}: PeiDetailsActionsProps): React.JSX.Element {
    const pdfActions = permissions.pdf ? (
        <>
            <Button
                href={peiUrls.pdf(peiId)}
                target="_blank"
                rel="noopener noreferrer"
                tone="dark-red"
                leftIconClass="fa fa-file-pdf-o"
                label="PDF"
                title="Gerar PDF completo do PEI"
                aria-label="Gerar PDF completo do PEI"
            />
            <Button
                href={peiUrls.familyPdf(peiId)}
                target="_blank"
                rel="noopener noreferrer"
                tone="white"
                leftIconClass="fa fa-file-pdf-o"
                label="PDF para a Família"
                title="Gerar PDF do PEI para a família"
                aria-label="Gerar PDF do PEI para a família"
            />
        </>
    ) : undefined;

    return (
        <FormActions secondary={pdfActions} tourTarget={PEI_TOUR_TARGETS.detailsActions}>
            <StudentRecordReturnButton studentId={studentId} tab="peis" />
            {permissions.finish ? (
                <PeiConfirmAction
                    method="patch"
                    action={peiUrls.finish(peiId)}
                    label="Finalizar"
                    ariaLabel="Finalizar PEI"
                    tone="success"
                    iconClass="fa fa-check"
                    modalTitle="Finalizar PEI"
                    message="Após finalizar, o plano não poderá ser editado. Confirmar?"
                    confirmLabel="Confirmar finalização"
                    processingLabel="Finalizando PEI..."
                />
            ) : null}
            {permissions.delete ? (
                <PeiConfirmAction
                    method="delete"
                    action={peiUrls.destroy(peiId)}
                    label="Excluir"
                    ariaLabel="Excluir PEI"
                    tone="dark-red"
                    iconClass="fa fa-trash-o"
                    modalTitle="Excluir PEI"
                    message="Excluir permanentemente este PEI?"
                    confirmLabel="Confirmar exclusão"
                    processingLabel="Excluindo PEI..."
                />
            ) : null}
        </FormActions>
    );
}

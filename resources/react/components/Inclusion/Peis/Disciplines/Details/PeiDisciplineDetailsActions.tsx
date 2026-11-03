import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import PeiConfirmAction from '../../PeiConfirmAction';
import { peiDisciplineUrls, peiUrls } from '../../Peis.routes';
import type { PeiDisciplineShowPermissions } from '../../Peis.types';
import { PEI_TOUR_TARGETS } from '../../peiTours';

interface PeiDisciplineDetailsActionsProps {
    peiId: number;
    disciplineId: number;
    permissions: PeiDisciplineShowPermissions;
}

/** Rodapé fixo da adaptação: PDF à esquerda; voltar ao PEI, editar e excluir ao centro. */
export default function PeiDisciplineDetailsActions({
    peiId,
    disciplineId,
    permissions,
}: PeiDisciplineDetailsActionsProps): React.JSX.Element {
    const pdfAction = permissions.pdf ? (
        <Button
            href={peiDisciplineUrls.pdf(peiId, disciplineId)}
            target="_blank"
            rel="noopener noreferrer"
            tone="dark-red"
            leftIconClass="fa fa-file-pdf-o"
            label="PDF"
            title="Gerar PDF da adaptação"
            aria-label="Gerar PDF da adaptação"
        />
    ) : undefined;

    return (
        <FormActions secondary={pdfAction} tourTarget={PEI_TOUR_TARGETS.disciplineDetailsActions}>
            <Button
                href={peiUrls.showTab(peiId, 'disciplines')}
                tone="cancel"
                label="Voltar"
                title="Voltar para o PEI"
                aria-label="Voltar para o PEI"
            />
            {permissions.update ? (
                <Button
                    href={peiDisciplineUrls.edit(peiId, disciplineId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar adaptação"
                    aria-label="Editar adaptação"
                />
            ) : null}
            {permissions.delete ? (
                <PeiConfirmAction
                    method="delete"
                    action={peiDisciplineUrls.destroy(peiId, disciplineId)}
                    label="Excluir"
                    ariaLabel="Excluir adaptação"
                    tone="dark-red"
                    iconClass="fa fa-trash-o"
                    modalTitle="Excluir Adaptação"
                    message="Deseja realmente excluir esta adaptação?"
                    confirmLabel="Confirmar exclusão"
                    processingLabel="Excluindo adaptação..."
                />
            ) : null}
        </FormActions>
    );
}

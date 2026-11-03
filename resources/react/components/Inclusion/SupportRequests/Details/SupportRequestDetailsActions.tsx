import { studentRecordUrl } from '@/components/Inclusion/Students/Students.routes';
import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { supportRequestUrls } from '../SupportRequests.routes';
import type { SupportRequestPermissions, SupportRequestRecord } from '../SupportRequests.types';
import { SUPPORT_REQUEST_TOUR_TARGETS } from '../supportRequestTours';

export default function SupportRequestDetailsActions({
    record,
    can,
    busy,
    onDelete,
    fromStudent,
}: {
    record: SupportRequestRecord;
    can: SupportRequestPermissions;
    busy: boolean;
    onDelete: () => void;
    fromStudent: boolean;
}): React.JSX.Element {
    const backUrl = fromStudent
        ? studentRecordUrl(record.student_id, 'support-requests')
        : supportRequestUrls.index;
    return (
        <FormActions
            tourTarget={SUPPORT_REQUEST_TOUR_TARGETS.detailsActions}
            secondary={
                <Button
                    href={supportRequestUrls.pdf(record.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    tone="dark-red"
                    leftIconClass="fa fa-file-pdf-o"
                    label="PDF"
                    title="Gerar PDF da solicitação"
                    disabled={busy}
                />
            }
        >
            <Button href={backUrl} tone="cancel" label="Voltar" disabled={busy} />
            {can.update ? (
                <Button
                    href={supportRequestUrls.edit(record.id, fromStudent)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    disabled={busy}
                />
            ) : null}
            {can.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    disabled={busy}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

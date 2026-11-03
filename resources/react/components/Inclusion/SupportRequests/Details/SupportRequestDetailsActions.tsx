import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { supportRequestUrls } from '../SupportRequests.routes';
import type { SupportRequestPermissions, SupportRequestRecord } from '../SupportRequests.types';

export default function SupportRequestDetailsActions({
    record,
    can,
    busy,
    onDelete,
}: {
    record: SupportRequestRecord;
    can: SupportRequestPermissions;
    busy: boolean;
    onDelete: () => void;
}): React.JSX.Element {
    return (
        <FormActions
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
            <Button href={supportRequestUrls.index} tone="cancel" label="Voltar" disabled={busy} />
            {can.update ? (
                <Button
                    href={supportRequestUrls.edit(record.id)}
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

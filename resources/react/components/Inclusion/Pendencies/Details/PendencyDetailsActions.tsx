import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { pendencyUrls } from '../Pendencies.routes';
import type { PendencyDetailsPermissions } from '../Pendencies.types';

interface PendencyDetailsActionsProps {
    pendencyId: number;
    permissions: PendencyDetailsPermissions;
    processing: boolean;
    onComplete: () => void;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, editar, concluir e excluir. */
export default function PendencyDetailsActions({
    pendencyId,
    permissions,
    processing,
    onComplete,
    onDelete,
}: PendencyDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions>
            <Button
                href={pendencyUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para pendências"
                aria-label="Voltar para pendências"
                disabled={processing}
            />
            {permissions.edit ? (
                <Button
                    href={pendencyUrls.edit(pendencyId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar pendência"
                    aria-label="Editar pendência"
                />
            ) : null}
            {permissions.complete ? (
                <Button
                    tone="success"
                    leftIconClass="fa fa-check"
                    label="Marcar como Concluída"
                    title="Marcar pendência como concluída"
                    aria-label="Marcar pendência como concluída"
                    disabled={processing}
                    onClick={onComplete}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir pendência"
                    aria-label="Excluir pendência"
                    disabled={processing}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

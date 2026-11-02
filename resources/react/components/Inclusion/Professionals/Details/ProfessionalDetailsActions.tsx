import FormActions from '@/components/Forms/FormActions/FormActions';
import ImpersonationAction from '@/components/Navigation/ImpersonationAction/ImpersonationAction';
import Button from '@/components/UI/Button/Button';
import { professionalUrls } from '../Professionals.routes';
import type { ProfessionalDetailsPermissions } from '../Professionals.types';

interface ProfessionalDetailsActionsProps {
    professionalId: number;
    name: string;
    /** Usuário que o administrador superior pode representar ("Entrar como"). */
    impersonationUserId: number | null;
    permissions: ProfessionalDetailsPermissions;
    deleting: boolean;
    busy: boolean;
    onImpersonatingChange: (processing: boolean) => void;
    onDelete: () => void;
}

/** Rodapé da visualização: "Entrar como" à esquerda; voltar, editar e excluir ao centro. */
export default function ProfessionalDetailsActions({
    professionalId,
    name,
    impersonationUserId,
    permissions,
    deleting,
    busy,
    onImpersonatingChange,
    onDelete,
}: ProfessionalDetailsActionsProps): React.JSX.Element {
    const impersonation =
        impersonationUserId !== null ? (
            <ImpersonationAction
                userId={impersonationUserId}
                name={name}
                disabled={deleting}
                onProcessingChange={onImpersonatingChange}
            />
        ) : undefined;

    return (
        <FormActions secondary={impersonation}>
            <Button
                href={professionalUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para profissionais"
                aria-label="Voltar para profissionais"
                disabled={busy}
            />
            {permissions.update ? (
                <Button
                    href={professionalUrls.edit(professionalId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar profissional"
                    aria-label="Editar profissional"
                    disabled={busy}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir profissional"
                    aria-label="Excluir profissional"
                    disabled={busy}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

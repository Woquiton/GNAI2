import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { deficiencyUrls } from '../Deficiencies.routes';
import type { DeficiencyDetailsPermissions } from '../Deficiencies.types';
import { DEFICIENCY_TOUR_TARGETS } from '../deficiencyTours';

interface DeficiencyDetailsActionsProps {
    deficiencyId: number;
    permissions: DeficiencyDetailsPermissions;
    /** Exclusão em andamento. */
    busy: boolean;
    /** Texto de processamento exibido no rodapé. */
    status?: string;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, editar e excluir. */
export default function DeficiencyDetailsActions({
    deficiencyId,
    permissions,
    busy,
    status,
    onDelete,
}: DeficiencyDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions status={status} tourTarget={DEFICIENCY_TOUR_TARGETS.detailsActions}>
            <Button
                href={deficiencyUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para perfis de atendimento"
                aria-label="Voltar para perfis de atendimento"
                disabled={busy}
            />
            {permissions.update ? (
                <Button
                    href={deficiencyUrls.edit(deficiencyId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar perfil de atendimento"
                    aria-label="Editar perfil de atendimento"
                    disabled={busy}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir perfil de atendimento"
                    aria-label="Excluir perfil de atendimento"
                    disabled={busy}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

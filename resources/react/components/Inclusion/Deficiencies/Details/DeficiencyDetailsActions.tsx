import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { deficiencyUrls } from '../Deficiencies.routes';
import type { DeficiencyDetailsPermissions } from '../Deficiencies.types';

interface DeficiencyDetailsActionsProps {
    deficiencyId: number;
    active: boolean;
    permissions: DeficiencyDetailsPermissions;
    /** Exclusão ou troca de status em andamento. */
    busy: boolean;
    /** Texto de processamento exibido no rodapé. */
    status?: string;
    onToggleActive: () => void;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, editar, ativar/desativar (sem confirmação) e excluir. */
export default function DeficiencyDetailsActions({
    deficiencyId,
    active,
    permissions,
    busy,
    status,
    onToggleActive,
    onDelete,
}: DeficiencyDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions status={status}>
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
            {permissions.update ? (
                <Button
                    tone="inverse"
                    leftIconClass={active ? 'fa fa-toggle-on' : 'fa fa-toggle-off'}
                    label={active ? 'Desativar' : 'Ativar'}
                    title={`${active ? 'Desativar' : 'Ativar'} perfil de atendimento`}
                    aria-label={`${active ? 'Desativar' : 'Ativar'} perfil de atendimento`}
                    disabled={busy}
                    onClick={onToggleActive}
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

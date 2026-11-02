import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { disciplineUrls } from '../Disciplines.routes';
import type { DisciplineDetailsPermissions } from '../Disciplines.types';

interface DisciplineDetailsActionsProps {
    disciplineId: number;
    permissions: DisciplineDetailsPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, editar e excluir. */
export default function DisciplineDetailsActions({
    disciplineId,
    permissions,
    deleting,
    onDelete,
}: DisciplineDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions>
            <Button
                href={disciplineUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para disciplinas"
                aria-label="Voltar para disciplinas"
                disabled={deleting}
            />
            {permissions.update ? (
                <Button
                    href={disciplineUrls.edit(disciplineId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar disciplina"
                    aria-label="Editar disciplina"
                    disabled={deleting}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir disciplina"
                    aria-label="Excluir disciplina"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { guardianUrls } from '../Guardians.routes';
import type { GuardianShowProps } from '../Guardians.types';

interface GuardianDetailsActionsProps {
    studentId: number;
    guardianId: number;
    permissions: GuardianShowProps['can'];
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar ao prontuário, editar e excluir. */
export default function GuardianDetailsActions({
    studentId,
    guardianId,
    permissions,
    deleting,
    onDelete,
}: GuardianDetailsActionsProps): React.JSX.Element {
    const urls = guardianUrls(studentId);

    return (
        <FormActions>
            <Button
                href={urls.record}
                tone="cancel"
                label="Voltar"
                title="Voltar para os responsáveis no prontuário do aluno"
                aria-label="Voltar para os responsáveis no prontuário do aluno"
                disabled={deleting}
            />
            {permissions.update ? (
                <Button
                    href={urls.edit(guardianId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar responsável"
                    aria-label="Editar responsável"
                    disabled={deleting}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir responsável"
                    aria-label="Excluir responsável"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

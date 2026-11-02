import FormActions from '@/components/Forms/FormActions/FormActions';
import ImpersonationAction from '@/components/Navigation/ImpersonationAction/ImpersonationAction';
import Button from '@/components/UI/Button/Button';
import { teacherUrls } from '../Teachers.routes';
import type { TeacherDetailsPermissions } from '../Teachers.types';

interface TeacherDetailsActionsProps {
    teacherId: number;
    name: string;
    /** Usuário que o administrador superior pode representar ("Entrar como"). */
    impersonationUserId: number | null;
    permissions: TeacherDetailsPermissions;
    busy: boolean;
    onImpersonatingChange: (processing: boolean) => void;
    onDelete: () => void;
}

/**
 * Rodapé da visualização: "Entrar como" à esquerda; voltar, gerenciar disciplinas, editar e
 * excluir ao centro.
 */
export default function TeacherDetailsActions({
    teacherId,
    name,
    impersonationUserId,
    permissions,
    busy,
    onImpersonatingChange,
    onDelete,
}: TeacherDetailsActionsProps): React.JSX.Element {
    const impersonation =
        impersonationUserId !== null ? (
            <ImpersonationAction
                userId={impersonationUserId}
                name={name}
                disabled={busy}
                onProcessingChange={onImpersonatingChange}
            />
        ) : undefined;

    return (
        <FormActions secondary={impersonation}>
            <Button
                href={teacherUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para professores"
                aria-label="Voltar para professores"
                disabled={busy}
            />
            {permissions.update ? (
                <Button
                    href={teacherUrls.disciplines(teacherId)}
                    tone="dark-blue"
                    leftIconClass="fa fa-book"
                    label="Gerenciar Disciplinas"
                    title="Gerenciar disciplinas do professor"
                    aria-label="Gerenciar disciplinas do professor"
                    disabled={busy}
                />
            ) : null}
            {permissions.update ? (
                <Button
                    href={teacherUrls.edit(teacherId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar perfil do professor"
                    aria-label="Editar perfil do professor"
                    disabled={busy}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir professor"
                    aria-label="Excluir professor"
                    disabled={busy}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

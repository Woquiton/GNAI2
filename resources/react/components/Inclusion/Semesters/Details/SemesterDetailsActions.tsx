import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { semesterUrls } from '../Semesters.routes';
import type { SemesterDetailsPermissions } from '../Semesters.types';

interface SemesterDetailsActionsProps {
    semesterId: number;
    permissions: SemesterDetailsPermissions;
    /** O semestre atual não pode ser excluído. */
    isCurrent: boolean;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, editar e excluir. */
export default function SemesterDetailsActions({
    semesterId,
    permissions,
    isCurrent,
    deleting,
    onDelete,
}: SemesterDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions>
            <Button
                href={semesterUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para semestres"
                aria-label="Voltar para semestres"
                disabled={deleting}
            />
            {permissions.update ? (
                <Button
                    href={semesterUrls.edit(semesterId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar semestre"
                    aria-label="Editar semestre"
                    disabled={deleting}
                />
            ) : null}
            {permissions.delete && !isCurrent ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir semestre"
                    aria-label="Excluir semestre"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

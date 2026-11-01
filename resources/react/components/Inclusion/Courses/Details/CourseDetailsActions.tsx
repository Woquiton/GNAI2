import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { courseUrls } from '../Courses.routes';
import type { CourseDetailsPermissions } from '../Courses.types';

interface CourseDetailsActionsProps {
    courseId: number;
    permissions: CourseDetailsPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, editar e excluir. */
export default function CourseDetailsActions({
    courseId,
    permissions,
    deleting,
    onDelete,
}: CourseDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions>
            <Button
                href={courseUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para cursos"
                aria-label="Voltar para cursos"
                disabled={deleting}
            />
            {permissions.update ? (
                <Button
                    href={courseUrls.edit(courseId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar curso"
                    aria-label="Editar curso"
                    disabled={deleting}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir curso"
                    aria-label="Excluir curso"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

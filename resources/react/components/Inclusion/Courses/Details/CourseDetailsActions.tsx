import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { COURSE_TOUR_TARGETS } from '../courseTours';
import { courseUrls } from '../Courses.routes';
import type { CourseDetailsPermissions } from '../Courses.types';

interface CourseDetailsActionsProps {
    courseId: number;
    permissions: CourseDetailsPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo da visualização: voltar, virada de semestre, editar e excluir. */
export default function CourseDetailsActions({
    courseId,
    permissions,
    deleting,
    onDelete,
}: CourseDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions tourTarget={COURSE_TOUR_TARGETS.detailsActions}>
            <Button
                href={courseUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para cursos"
                aria-label="Voltar para cursos"
                disabled={deleting}
            />
            {permissions.rollover ? (
                <Button
                    href={courseUrls.rollover(courseId)}
                    tone="purple"
                    leftIconClass="fa fa-forward"
                    label="Virada de semestre"
                    title="Registrar os alunos do curso no novo semestre"
                    aria-label="Registrar os alunos do curso no novo semestre"
                    disabled={deleting}
                />
            ) : null}
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

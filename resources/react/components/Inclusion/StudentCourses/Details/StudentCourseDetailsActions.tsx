import FormActions from '@/components/Forms/FormActions/FormActions';
import StudentRecordReturnButton from '@/components/Inclusion/Students/StudentRecordReturnButton';
import Button from '@/components/UI/Button/Button';
import { STUDENT_COURSE_RECORD_TAB } from '../StudentCourses.constants';
import { studentCourseUrls } from '../StudentCourses.routes';
import type { StudentCourseDetailsPermissions } from '../StudentCourses.types';

interface StudentCourseDetailsActionsProps {
    studentId: number;
    studentCourseId: number;
    courseName: string;
    isCurrent: boolean;
    permissions: StudentCourseDetailsPermissions;
    processing: boolean;
    onMakeCurrent: () => void;
    onDelete: () => void;
}

/**
 * Rodapé da visualização: voltar ao prontuário; editar somente o curso atual; tornar atual uma
 * matrícula do histórico; excluir.
 */
export default function StudentCourseDetailsActions({
    studentId,
    studentCourseId,
    courseName,
    isCurrent,
    permissions,
    processing,
    onMakeCurrent,
    onDelete,
}: StudentCourseDetailsActionsProps): React.JSX.Element {
    const makeCurrentLabel = `Tornar ${courseName} o curso atual`;

    return (
        <FormActions>
            <StudentRecordReturnButton studentId={studentId} tab={STUDENT_COURSE_RECORD_TAB} />
            {permissions.update && isCurrent ? (
                <Button
                    href={studentCourseUrls.edit(studentCourseId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar matrícula"
                    aria-label="Editar matrícula"
                />
            ) : null}
            {permissions.update && !isCurrent ? (
                <Button
                    tone="success"
                    leftIconClass="fa fa-check-circle"
                    label="Tornar Atual"
                    title={makeCurrentLabel}
                    aria-label={makeCurrentLabel}
                    disabled={processing}
                    onClick={onMakeCurrent}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir matrícula"
                    aria-label="Excluir matrícula"
                    disabled={processing}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

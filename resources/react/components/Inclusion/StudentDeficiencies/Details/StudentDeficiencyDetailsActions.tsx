import FormActions from '@/components/Forms/FormActions/FormActions';
import StudentRecordReturnButton from '@/components/Inclusion/Students/StudentRecordReturnButton';
import Button from '@/components/UI/Button/Button';
import { STUDENT_DEFICIENCY_RECORD_TAB } from '../StudentDeficiencies.constants';
import { studentDeficiencyUrls } from '../StudentDeficiencies.routes';
import type { StudentDeficiencyDetailsPermissions } from '../StudentDeficiencies.types';
import { STUDENT_DEFICIENCY_TOUR_TARGETS } from '../studentDeficiencyTours';

interface StudentDeficiencyDetailsActionsProps {
    studentId: number;
    studentDeficiencyId: number;
    permissions: StudentDeficiencyDetailsPermissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé da visualização: voltar ao prontuário, editar e excluir. */
export default function StudentDeficiencyDetailsActions({
    studentId,
    studentDeficiencyId,
    permissions,
    deleting,
    onDelete,
}: StudentDeficiencyDetailsActionsProps): React.JSX.Element {
    return (
        <FormActions tourTarget={STUDENT_DEFICIENCY_TOUR_TARGETS.detailsActions}>
            <StudentRecordReturnButton studentId={studentId} tab={STUDENT_DEFICIENCY_RECORD_TAB} />
            {permissions.update ? (
                <Button
                    href={studentDeficiencyUrls.edit(studentId, studentDeficiencyId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar perfil de atendimento"
                    aria-label="Editar perfil de atendimento"
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir perfil de atendimento"
                    aria-label="Excluir perfil de atendimento"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { studentUrls } from '../Students.routes';
import type { Permissions } from '../Students.types';
import { STUDENT_TOUR_TARGETS } from '../studentTours';

interface StudentDetailsActionsProps {
    studentId: number;
    studentName: string;
    permissions: Permissions;
    deleting: boolean;
    onDelete: () => void;
}

/** Rodapé fixo do prontuário: PDF à esquerda; voltar, editar e excluir ao centro. */
export default function StudentDetailsActions({
    studentId,
    studentName,
    permissions,
    deleting,
    onDelete,
}: StudentDetailsActionsProps): React.JSX.Element {
    const pdfAction = permissions['student.view'] ? (
        <Button
            href={studentUrls.pdf(studentId)}
            target="_blank"
            rel="noopener noreferrer"
            tone="dark-red"
            leftIconClass="fa fa-file-pdf-o"
            label="PDF"
            title="Gerar PDF do aluno"
            aria-label="Gerar PDF do aluno"
        />
    ) : undefined;

    return (
        <FormActions secondary={pdfAction} tourTarget={STUDENT_TOUR_TARGETS.recordActions}>
            <Button
                href={studentUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para alunos"
                aria-label="Voltar para alunos"
            />
            {permissions['student.update'] ? (
                <Button
                    href={studentUrls.edit(studentId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar cadastro do aluno"
                    aria-label="Editar cadastro do aluno"
                />
            ) : null}
            {permissions['student.delete'] ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title={`Excluir aluno ${studentName}`}
                    aria-label={`Excluir aluno ${studentName}`}
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

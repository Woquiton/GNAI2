import FormActions from '@/components/Forms/FormActions/FormActions';
import StudentRecordReturnButton from '@/components/Inclusion/Students/StudentRecordReturnButton';
import Button from '@/components/UI/Button/Button';
import { caseStudiesTab, caseStudyUrls } from '../CaseStudies.routes';
import type { CaseStudyShowPermissions } from '../CaseStudies.types';

interface CaseStudyDetailsActionsProps {
    caseStudyId: number;
    studentId: number;
    permissions: CaseStudyShowPermissions;
    completing: boolean;
    deleting: boolean;
    onComplete: () => void;
    onDelete: () => void;
}

/**
 * Rodapé fixo da visualização: PDF à esquerda; voltar ao prontuário, editar, concluir, criar PAEE
 * e excluir ao centro.
 */
export default function CaseStudyDetailsActions({
    caseStudyId,
    studentId,
    permissions,
    completing,
    deleting,
    onComplete,
    onDelete,
}: CaseStudyDetailsActionsProps): React.JSX.Element {
    const pdfAction = permissions.pdf ? (
        <Button
            href={caseStudyUrls.pdf(caseStudyId)}
            target="_blank"
            rel="noopener noreferrer"
            tone="dark-red"
            leftIconClass="fa fa-file-pdf-o"
            label="PDF"
            title="Gerar PDF do Estudo de Caso"
            aria-label="Gerar PDF do Estudo de Caso"
        />
    ) : undefined;

    return (
        <FormActions secondary={pdfAction}>
            <StudentRecordReturnButton studentId={studentId} tab={caseStudiesTab} />
            {permissions.update ? (
                <Button
                    href={caseStudyUrls.edit(caseStudyId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    aria-label="Editar Estudo de Caso"
                />
            ) : null}
            {permissions.complete ? (
                <Button
                    type="button"
                    tone="success"
                    leftIconClass="fa fa-check-circle"
                    label="Concluir"
                    title="Concluir Estudo de Caso"
                    aria-label="Concluir Estudo de Caso"
                    disabled={completing}
                    onClick={onComplete}
                />
            ) : null}
            {permissions.createPaee ? (
                <Button
                    href={caseStudyUrls.createPaee(caseStudyId)}
                    tone="success"
                    leftIconClass="fa fa-plus"
                    label="Criar PAEE"
                    aria-label="Criar PAEE a partir deste Estudo de Caso"
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    type="button"
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir Estudo de Caso"
                    aria-label="Excluir Estudo de Caso"
                    disabled={deleting}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

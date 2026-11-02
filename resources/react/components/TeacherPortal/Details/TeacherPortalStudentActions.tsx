import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { teacherPortalUrls } from '../TeacherPortal.routes';

/** Rodapé fixo do prontuário em modo leitura: somente o retorno à lista do professor. */
export default function TeacherPortalStudentActions(): React.JSX.Element {
    return (
        <FormActions>
            <Button
                href={teacherPortalUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para meus alunos"
                aria-label="Voltar para meus alunos"
            />
        </FormActions>
    );
}

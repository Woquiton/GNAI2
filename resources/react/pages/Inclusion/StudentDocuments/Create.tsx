import StudentDocumentForm from '@/components/Inclusion/StudentDocuments/Form/StudentDocumentForm';
import { studentDocumentBreadcrumb } from '@/components/Inclusion/StudentDocuments/StudentDocuments.routes';
import type { StudentDocumentFormOptions } from '@/components/Inclusion/StudentDocuments/StudentDocuments.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionStudentDocumentsCreatePage({
    student,
    types,
    semester,
}: StudentDocumentFormOptions): React.JSX.Element {
    return (
        <BusinessPage
            title={`Novo Documento para ${student.person.name}`}
            subtitle="Faça o upload de laudos, avaliações ou planos de AEE para este estudante."
            breadcrumbItems={studentDocumentBreadcrumb({
                student,
                current: 'Cadastrar documento do aluno',
            })}
        >
            <StudentDocumentForm student={student} types={types} semester={semester} />
        </BusinessPage>
    );
}

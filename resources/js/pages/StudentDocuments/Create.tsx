import StudentDocumentForm from '@/components/StudentDocuments/Form/StudentDocumentForm';
import { studentDocumentBreadcrumb } from '@/components/StudentDocuments/StudentDocuments.routes';
import type { StudentDocumentFormOptions } from '@/components/StudentDocuments/StudentDocuments.types';
import { studentDocumentCreateTour } from '@/components/StudentDocuments/studentDocumentTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function StudentDocumentsCreatePage({
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
            tour={studentDocumentCreateTour}
        >
            <StudentDocumentForm student={student} types={types} semester={semester} />
        </BusinessPage>
    );
}

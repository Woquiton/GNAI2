import StudentDocumentForm from '@/components/Inclusion/StudentDocuments/Form/StudentDocumentForm';
import { studentDocumentBreadcrumb } from '@/components/Inclusion/StudentDocuments/StudentDocuments.routes';
import type { StudentDocumentEditProps } from '@/components/Inclusion/StudentDocuments/StudentDocuments.types';
import { studentDocumentEditTour } from '@/components/Inclusion/StudentDocuments/studentDocumentTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionStudentDocumentsEditPage({
    student,
    types,
    semester,
    studentDocument,
}: StudentDocumentEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Documento"
            subtitle="Atualize as informações do documento ou substitua o arquivo anexado."
            breadcrumbItems={studentDocumentBreadcrumb({
                student,
                documentTitle: studentDocument.title,
                current: 'Editar',
            })}
            tour={studentDocumentEditTour}
        >
            <StudentDocumentForm
                key={studentDocument.id}
                student={student}
                types={types}
                semester={semester}
                studentDocument={studentDocument}
            />
        </BusinessPage>
    );
}

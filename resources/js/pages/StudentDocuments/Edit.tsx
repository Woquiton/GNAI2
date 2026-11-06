import StudentDocumentForm from '@/components/StudentDocuments/Form/StudentDocumentForm';
import { studentDocumentBreadcrumb } from '@/components/StudentDocuments/StudentDocuments.routes';
import type { StudentDocumentEditProps } from '@/components/StudentDocuments/StudentDocuments.types';
import { studentDocumentEditTour } from '@/components/StudentDocuments/studentDocumentTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function StudentDocumentsEditPage({
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

import SemesterForm from '@/components/Semesters/Form/SemesterForm';
import { semesterBreadcrumb } from '@/components/Semesters/Semesters.routes';
import { semesterCreateTour } from '@/components/Semesters/semesterTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function SemestersCreatePage(): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Novo Semestre"
            subtitle="Defina o período letivo e sua vigência no sistema."
            breadcrumbItems={semesterBreadcrumb({ current: 'Cadastrar' })}
            tour={semesterCreateTour}
        >
            <SemesterForm />
        </BusinessPage>
    );
}

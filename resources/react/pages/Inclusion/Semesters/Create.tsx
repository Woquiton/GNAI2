import SemesterForm from '@/components/Inclusion/Semesters/Form/SemesterForm';
import { semesterBreadcrumb } from '@/components/Inclusion/Semesters/Semesters.routes';
import { semesterCreateTour } from '@/components/Inclusion/Semesters/semesterTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionSemestersCreatePage(): React.JSX.Element {
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

import SemesterForm from '@/components/Inclusion/Semesters/Form/SemesterForm';
import { semesterLabel } from '@/components/Inclusion/Semesters/Semesters.constants';
import { semesterBreadcrumb } from '@/components/Inclusion/Semesters/Semesters.routes';
import type { SemesterEditProps } from '@/components/Inclusion/Semesters/Semesters.types';
import { semesterEditTour } from '@/components/Inclusion/Semesters/semesterTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionSemestersEditPage({
    semester,
}: SemesterEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Semestre"
            subtitle={`Alterando: ${semesterLabel(semester)}`}
            breadcrumbItems={semesterBreadcrumb({ semester, current: 'Editar' })}
            tour={semesterEditTour}
        >
            <SemesterForm key={semester.id} semester={semester} />
        </BusinessPage>
    );
}

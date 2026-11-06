import SemesterForm from '@/components/Semesters/Form/SemesterForm';
import { semesterLabel } from '@/components/Semesters/Semesters.constants';
import { semesterBreadcrumb } from '@/components/Semesters/Semesters.routes';
import type { SemesterEditProps } from '@/components/Semesters/Semesters.types';
import { semesterEditTour } from '@/components/Semesters/semesterTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function SemestersEditPage({
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

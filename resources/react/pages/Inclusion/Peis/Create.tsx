import PeiCreateForm from '@/components/Inclusion/Peis/Form/PeiCreateForm';
import { peiCreateBreadcrumb } from '@/components/Inclusion/Peis/Peis.routes';
import type { PeiCreateProps } from '@/components/Inclusion/Peis/Peis.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionPeisCreatePage({
    student,
    course,
    semester,
}: PeiCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Gerar Novo PEI"
            subtitle="Revise as informações abaixo. O sistema criará automaticamente o PEI com base nesses dados."
            breadcrumbItems={peiCreateBreadcrumb(student)}
        >
            <PeiCreateForm student={student} course={course} semester={semester} />
        </BusinessPage>
    );
}

import PeiDetails from '@/components/Inclusion/Peis/Details/PeiDetails';
import PeiDetailsActions from '@/components/Inclusion/Peis/Details/PeiDetailsActions';
import { peiShowSubtitle } from '@/components/Inclusion/Peis/Peis.constants';
import { peiShowBreadcrumb } from '@/components/Inclusion/Peis/Peis.routes';
import type { PeiShowProps } from '@/components/Inclusion/Peis/Peis.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { peiShowTour } from '@/components/Inclusion/Peis/peiTours';

export default function InclusionPeisShowPage(props: PeiShowProps): React.JSX.Element {
    const { pei, student, can } = props;

    return (
        <BusinessPage
            title="Plano Educacional Individualizado"
            subtitle={peiShowSubtitle(pei)}
            breadcrumbItems={peiShowBreadcrumb(pei, student)}
            tour={peiShowTour}
        >
            <PeiDetails {...props} />
            <PeiDetailsActions peiId={pei.id} studentId={student.id} permissions={can} />
        </BusinessPage>
    );
}

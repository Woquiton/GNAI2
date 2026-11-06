import PeiDetails from '@/components/Peis/Details/PeiDetails';
import PeiDetailsActions from '@/components/Peis/Details/PeiDetailsActions';
import { peiShowSubtitle } from '@/components/Peis/Peis.constants';
import { peiShowBreadcrumb } from '@/components/Peis/Peis.routes';
import type { PeiShowProps } from '@/components/Peis/Peis.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { peiShowTour } from '@/components/Peis/peiTours';

export default function PeisShowPage(props: PeiShowProps): React.JSX.Element {
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

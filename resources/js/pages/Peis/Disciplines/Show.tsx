import PeiDisciplineDetails from '@/components/Peis/Disciplines/Details/PeiDisciplineDetails';
import PeiDisciplineDetailsActions from '@/components/Peis/Disciplines/Details/PeiDisciplineDetailsActions';
import { peiDisciplineName } from '@/components/Peis/Peis.constants';
import { peiDisciplineBreadcrumb } from '@/components/Peis/Peis.routes';
import type { PeiDisciplineShowProps } from '@/components/Peis/Peis.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { peiDisciplineShowTour } from '@/components/Peis/peiTours';

export default function PeisDisciplinesShowPage({
    pei,
    student,
    peiDiscipline,
    revisions,
    can,
}: PeiDisciplineShowProps): React.JSX.Element {
    const disciplineName = peiDisciplineName(peiDiscipline);

    return (
        <BusinessPage
            title={`Planejamento da Disciplina ${disciplineName}`}
            subtitle={`Visualize a adaptação para a disciplina ${disciplineName}.`}
            breadcrumbItems={peiDisciplineBreadcrumb({
                peiId: pei.id,
                peiLabel: `PEI #${pei.id}`,
                student,
                current: disciplineName,
            })}
            tour={peiDisciplineShowTour}
        >
            <PeiDisciplineDetails
                pei={pei}
                peiDiscipline={peiDiscipline}
                revisions={revisions}
                can={can}
            />
            <PeiDisciplineDetailsActions
                peiId={pei.id}
                disciplineId={peiDiscipline.id}
                permissions={can}
            />
        </BusinessPage>
    );
}

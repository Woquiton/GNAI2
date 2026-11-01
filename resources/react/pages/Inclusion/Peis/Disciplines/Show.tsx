import PeiDisciplineDetails from '@/components/Inclusion/Peis/Disciplines/Details/PeiDisciplineDetails';
import PeiDisciplineDetailsActions from '@/components/Inclusion/Peis/Disciplines/Details/PeiDisciplineDetailsActions';
import { peiDisciplineName } from '@/components/Inclusion/Peis/Peis.constants';
import { peiDisciplineBreadcrumb } from '@/components/Inclusion/Peis/Peis.routes';
import type { PeiDisciplineShowProps } from '@/components/Inclusion/Peis/Peis.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionPeisDisciplinesShowPage({
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

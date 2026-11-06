import PeiDisciplineForm from '@/components/Peis/Disciplines/Form/PeiDisciplineForm';
import { peiDisciplineBreadcrumb } from '@/components/Peis/Peis.routes';
import type { PeiDisciplineEditProps } from '@/components/Peis/Peis.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { peiDisciplineEditTour } from '@/components/Peis/peiTours';

export default function PeisDisciplinesEditPage({
    pei,
    peiDiscipline,
}: PeiDisciplineEditProps): React.JSX.Element {
    const disciplineName = peiDiscipline.discipline?.name ?? '';

    return (
        <BusinessPage
            title="Editar Adaptação Curricular"
            subtitle={`Atualize o planejamento pedagógico para a disciplina de ${disciplineName}.`}
            breadcrumbItems={peiDisciplineBreadcrumb({
                peiId: pei.id,
                peiLabel: 'PEI',
                current: 'Editar Adaptação',
            })}
            tour={peiDisciplineEditTour}
        >
            <PeiDisciplineForm key={peiDiscipline.id} pei={pei} peiDiscipline={peiDiscipline} />
        </BusinessPage>
    );
}

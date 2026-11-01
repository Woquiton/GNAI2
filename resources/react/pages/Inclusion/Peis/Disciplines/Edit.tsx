import PeiDisciplineForm from '@/components/Inclusion/Peis/Disciplines/Form/PeiDisciplineForm';
import { peiDisciplineBreadcrumb } from '@/components/Inclusion/Peis/Peis.routes';
import type { PeiDisciplineEditProps } from '@/components/Inclusion/Peis/Peis.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionPeisDisciplinesEditPage({
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
        >
            <PeiDisciplineForm key={peiDiscipline.id} pei={pei} peiDiscipline={peiDiscipline} />
        </BusinessPage>
    );
}

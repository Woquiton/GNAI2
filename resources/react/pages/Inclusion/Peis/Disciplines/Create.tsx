import PeiDisciplineBulkForm from '@/components/Inclusion/Peis/Disciplines/Form/PeiDisciplineBulkForm';
import { peiDisciplineBreadcrumb } from '@/components/Inclusion/Peis/Peis.routes';
import type { PeiDisciplineBulkProps } from '@/components/Inclusion/Peis/Peis.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { peiDisciplineCreateTour } from '@/components/Inclusion/Peis/peiTours';

export default function InclusionPeisDisciplinesCreatePage({
    pei,
    semesterLabel,
    studentPeriod,
    disciplines,
}: PeiDisciplineBulkProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Adaptação Curricular"
            subtitle="Para cada disciplina do curso, escolha o professor responsável. As disciplinas do período do aluno aparecem primeiro. As adaptações são criadas de uma vez; o conteúdo pedagógico (objetivos, metodologias etc.) de cada uma é preenchido em seguida, individualmente."
            breadcrumbItems={peiDisciplineBreadcrumb({
                peiId: pei.id,
                peiLabel: 'PEI',
                current: 'Cadastrar Adaptação',
            })}
            tour={peiDisciplineCreateTour}
        >
            <PeiDisciplineBulkForm
                pei={pei}
                semesterLabel={semesterLabel}
                studentPeriod={studentPeriod}
                disciplines={disciplines}
            />
        </BusinessPage>
    );
}

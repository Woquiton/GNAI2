import { disciplineBreadcrumb } from '@/components/Inclusion/Disciplines/Disciplines.routes';
import type { DisciplineEditProps } from '@/components/Inclusion/Disciplines/Disciplines.types';
import DisciplineForm from '@/components/Inclusion/Disciplines/Form/DisciplineForm';
import { disciplineEditTour } from '@/components/Inclusion/Disciplines/disciplineTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionDisciplinesEditPage({
    discipline,
}: DisciplineEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Disciplina"
            subtitle="Atualize as informações e o status da disciplina selecionada."
            breadcrumbItems={disciplineBreadcrumb({ discipline, current: 'Editar' })}
            tour={disciplineEditTour}
        >
            <DisciplineForm key={discipline.id} discipline={discipline} />
        </BusinessPage>
    );
}

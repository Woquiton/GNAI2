import { disciplineBreadcrumb } from '@/components/Disciplines/Disciplines.routes';
import DisciplineForm from '@/components/Disciplines/Form/DisciplineForm';
import { disciplineCreateTour } from '@/components/Disciplines/disciplineTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function DisciplinesCreatePage(): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Disciplina"
            subtitle="Defina o nome e descrição da matéria para o catálogo da instituição."
            breadcrumbItems={disciplineBreadcrumb({ current: 'Cadastrar' })}
            tour={disciplineCreateTour}
        >
            <DisciplineForm />
        </BusinessPage>
    );
}

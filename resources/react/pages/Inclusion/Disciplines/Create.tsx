import { disciplineBreadcrumb } from '@/components/Inclusion/Disciplines/Disciplines.routes';
import DisciplineForm from '@/components/Inclusion/Disciplines/Form/DisciplineForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionDisciplinesCreatePage(): React.JSX.Element {
    return (
        <BusinessPage
            title="Cadastrar Disciplina"
            subtitle="Defina o nome e descrição da matéria para o catálogo da instituição."
            breadcrumbItems={disciplineBreadcrumb({ current: 'Cadastrar' })}
        >
            <DisciplineForm />
        </BusinessPage>
    );
}

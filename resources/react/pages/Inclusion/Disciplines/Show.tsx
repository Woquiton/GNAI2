import DisciplineDetails from '@/components/Inclusion/Disciplines/Details/DisciplineDetails';
import DisciplineDetailsActions from '@/components/Inclusion/Disciplines/Details/DisciplineDetailsActions';
import DisciplineDeleteModal from '@/components/Inclusion/Disciplines/DisciplineDeleteModal';
import {
    disciplineBreadcrumb,
    disciplineUrls,
} from '@/components/Inclusion/Disciplines/Disciplines.routes';
import type { DisciplineShowProps } from '@/components/Inclusion/Disciplines/Disciplines.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionDisciplinesShowPage({
    discipline,
    can,
}: DisciplineShowProps): React.JSX.Element {
    const removal = useConfirmedAction<typeof discipline>({
        failureText: 'Não foi possível excluir a disciplina. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Detalhes da Disciplina"
            subtitle="Informações cadastrais e descrição da matéria."
            documentTitle={discipline.name}
            breadcrumbItems={disciplineBreadcrumb({ discipline })}
            busy={removal.processing}
        >
            <DisciplineDetails discipline={discipline} />
            <DisciplineDetailsActions
                disciplineId={discipline.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(discipline)}
            />
            <DisciplineDeleteModal
                discipline={removal.target}
                emphatic
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', disciplineUrls.destroy(discipline.id))}
            />
        </BusinessPage>
    );
}

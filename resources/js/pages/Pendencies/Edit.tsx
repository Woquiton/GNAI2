import PendencyForm from '@/components/Pendencies/Form/PendencyForm';
import { pendencyBreadcrumb } from '@/components/Pendencies/Pendencies.routes';
import type { PendencyEditProps } from '@/components/Pendencies/Pendencies.types';
import { pendencyEditTour } from '@/components/Pendencies/pendencyTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function PendenciesEditPage({
    pendency,
    pendencyForm,
    professionals,
    priorities,
}: PendencyEditProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Editar Pendência"
            subtitle="Atualize os dados da pendência."
            breadcrumbItems={pendencyBreadcrumb({
                record: { id: pendency.id, label: 'Pendência' },
                current: 'Editar',
            })}
            tour={pendencyEditTour}
        >
            <PendencyForm
                key={pendency.id}
                pendency={pendency}
                dueDate={pendencyForm.due_date}
                professionals={professionals}
                priorities={priorities}
            />
        </BusinessPage>
    );
}

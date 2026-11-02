import PendencyForm from '@/components/Inclusion/Pendencies/Form/PendencyForm';
import { pendencyBreadcrumb } from '@/components/Inclusion/Pendencies/Pendencies.routes';
import type { PendencyEditProps } from '@/components/Inclusion/Pendencies/Pendencies.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionPendenciesEditPage({
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

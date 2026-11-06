import { aeeRecordBreadcrumb } from '@/components/AeeRecords/AeeRecords.routes';
import type { AeeRecordCreateProps } from '@/components/AeeRecords/AeeRecords.types';
import AeeRecordForm from '@/components/AeeRecords/Form/AeeRecordForm';
import { aeeRecordCreateTour } from '@/components/AeeRecords/aeeRecordTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function AeeRecordsCreatePage({
    session,
    guardiansByStudent,
}: AeeRecordCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Registro de Atendimento Educacional Especializado"
            subtitle={`Agendamento #${session.id}`}
            tour={aeeRecordCreateTour}
            breadcrumbItems={aeeRecordBreadcrumb({ sessionId: session.id, current: 'Cadastrar' })}
        >
            <AeeRecordForm
                key={session.id}
                mode="session"
                session={session}
                guardiansByStudent={guardiansByStudent}
            />
        </BusinessPage>
    );
}

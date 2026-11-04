import { itemTypeLabels } from '@/components/Inclusion/Items/Items.constants';
import { formatTableListText, type TableListColumn } from '@/components/Tables/TableList/TableList';
import EmailDeliveryIndicator from '@/components/UI/EmailDeliveryIndicator/EmailDeliveryIndicator';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { waitlistStudentLabel } from '../Waitlists.constants';
import { waitlistUrls } from '../Waitlists.routes';
import type { WaitlistRecord } from '../Waitlists.types';

const NOT_INFORMED = 'Não informado';

function beneficiary(waitlist: WaitlistRecord): string {
    if (waitlist.student) {
        return waitlistStudentLabel(waitlist.student);
    }

    return waitlist.professional?.name ?? NOT_INFORMED;
}

/** Colunas da listagem; as complementares começam ocultas no seletor de colunas. */
export const waitlistColumns: TableListColumn<WaitlistRecord>[] = [
    {
        id: 'registration-email',
        label: 'E-mail',
        hideLabel: true,
        width: '4%',
        fixed: 'start',
        cellTitle: (waitlist) => waitlist.registration_email.label,
        render: (waitlist) => (
            <EmailDeliveryIndicator
                email={waitlist.registration_email}
                label={`Confirmação de entrada na fila #${waitlist.id}`}
            />
        ),
    },
    {
        id: 'notified_at',
        label: 'Notificado em',
        defaultVisible: false,
        render: (waitlist) => waitlist.notified_at_label ?? 'Não informado',
    },
    {
        id: 'fulfilled_at',
        label: 'Atendido em',
        defaultVisible: false,
        render: (waitlist) => waitlist.fulfilled_at_label ?? 'Não informado',
    },
    {
        id: 'cancelled_at',
        label: 'Cancelado em',
        defaultVisible: false,
        render: (waitlist) => waitlist.cancelled_at_label ?? 'Não informado',
    },
    {
        id: 'origin-semester',
        label: 'Semestre de origem',
        defaultVisible: false,
        render: (waitlist) => waitlist.semester_label ?? 'Sem vínculo: revisar calendário',
    },
    {
        id: 'item',
        label: 'Item',
        width: '22%',
        render: (waitlist) => (
            <a href={waitlistUrls.item(waitlist.waitlistable_id)} target="_blank" rel="noreferrer">
                {waitlist.item_name}
            </a>
        ),
    },
    { id: 'beneficiary', label: 'Beneficiário', width: '23%', render: beneficiary },
    {
        id: 'requested',
        label: 'Data da Solicitação',
        width: '18%',
        render: (waitlist) => waitlist.requested_at_label,
    },
    {
        id: 'status',
        label: 'Status',
        width: '13%',
        render: (waitlist) => (
            <TableLabel tone={waitlist.status_color}>{waitlist.status_label}</TableLabel>
        ),
    },
    { id: 'user', label: 'Usuário', width: '12%', render: (waitlist) => waitlist.user },
    {
        id: 'type',
        label: 'Tipo do item',
        width: '16%',
        defaultVisible: false,
        render: (waitlist) => itemTypeLabels[waitlist.item_type] ?? NOT_INFORMED,
    },
    {
        id: 'asset',
        label: 'Patrimônio / Tombamento',
        width: '16%',
        defaultVisible: false,
        render: (waitlist) => waitlist.asset_code || NOT_INFORMED,
    },
    {
        id: 'registration',
        label: 'Matrícula do aluno',
        width: '16%',
        defaultVisible: false,
        render: (waitlist) => waitlist.student?.registration || NOT_INFORMED,
    },
    {
        id: 'observation',
        label: 'Observações',
        width: '16%',
        defaultVisible: false,
        render: (waitlist) => formatTableListText(waitlist.observation),
    },
];

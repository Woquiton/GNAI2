import { Link } from '@inertiajs/react';
import { TableListRowActions, type TableListColumn } from '@/components/Tables/TableList/TableList';
import EmailDeliveryIndicator from '@/components/UI/EmailDeliveryIndicator/EmailDeliveryIndicator';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { emailStatusTones } from '../Emails.constants';
import { emailUrls } from '../Emails.routes';
import type { EmailRecord } from '../Emails.types';

export const emailColumns: TableListColumn<EmailRecord>[] = [
    {
        id: 'indicator',
        label: 'Envio',
        hideLabel: true,
        fixed: 'start',
        width: '5%',
        render: (email) => (
            <EmailDeliveryIndicator email={email.delivery} label={email.purpose_label} />
        ),
    },
    {
        id: 'recipient',
        label: 'Destinatário',
        width: '24%',
        cellTitle: (email) => [email.recipient_name, email.recipient_email].filter(Boolean).join(' · '),
        render: (email) => (
            <div className="emailInbox__recipient">
                <span>{email.recipient_name || email.recipient_email || 'Sem destinatário válido'}</span>
                {email.recipient_name && email.recipient_email ? (
                    <small>{email.recipient_email}</small>
                ) : null}
            </div>
        ),
    },
    {
        id: 'subject',
        label: 'Assunto',
        width: '29%',
        cellTitle: (email) => email.subject,
        render: (email) => <Link href={emailUrls.show(email.id)}>{email.subject}</Link>,
    },
    {
        id: 'status',
        label: 'Status',
        width: '19%',
        cellTitle: (email) => email.delivery.label,
        render: (email) => (
            <TableLabel tone={emailStatusTones[email.delivery.status]}>
                {email.delivery.label}
            </TableLabel>
        ),
    },
    {
        id: 'created_at',
        label: 'Registrado em',
        width: '15%',
        render: (email) => email.created_at_label || 'Não informado',
    },
    {
        id: 'context',
        label: 'Origem',
        defaultVisible: false,
        render: (email) => email.context_label,
    },
    {
        id: 'purpose',
        label: 'Finalidade',
        defaultVisible: false,
        render: (email) => email.purpose_label,
    },
    {
        id: 'attempts',
        label: 'Tentativas',
        defaultVisible: false,
        render: (email) => email.attempts,
    },
    {
        id: 'sent_at',
        label: 'Enviado em',
        defaultVisible: false,
        render: (email) => email.delivery.sent_at_label || 'Sem envio confirmado',
    },
    {
        id: 'actions',
        label: 'Ações',
        fixed: 'end',
        width: '8%',
        render: (email) => (
            <TableListRowActions
                view={{
                    href: emailUrls.show(email.id),
                    label: `Visualizar e-mail: ${email.subject}`,
                }}
            />
        ),
    },
];

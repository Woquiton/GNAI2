import { Link } from '@inertiajs/react';
import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import type { TableListColumn } from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import EmailDeliveryIndicator from '@/components/UI/EmailDeliveryIndicator/EmailDeliveryIndicator';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { emailStatusTones } from '../Emails.constants';
import { emailUrls } from '../Emails.routes';
import type { EmailRecord } from '../Emails.types';

export function emailColumns({
    selected,
    onSelect,
    onStar,
    processing,
    canSend,
}: {
    selected: string[];
    onSelect: (id: string, checked: boolean) => void;
    onStar: (email: EmailRecord) => void;
    processing: boolean;
    canSend: boolean;
}): TableListColumn<EmailRecord>[] {
    function destination(email: EmailRecord): string {
        return canSend && email.delivery.status === 'draft'
            ? emailUrls.draft(email.id)
            : emailUrls.show(email.id);
    }
    return [
        {
            id: 'selection',
            label: 'Seleção e favoritos',
            hideLabel: true,
            fixed: 'start',
            width: '17%',
            render: (email) => (
                <div className="emailInbox__rowControls">
                    <ChoiceControl
                        type="checkbox"
                        id={`email-select-${email.id}`}
                        tone="purple"
                        label={
                            <span className="emailInbox__sr">
                                Selecionar {email.subject || 'rascunho sem assunto'}
                            </span>
                        }
                        checked={selected.includes(email.id)}
                        disabled={processing}
                        onChange={(checked) => onSelect(email.id, checked)}
                    />
                    <Button
                        tone="link"
                        size="xs"
                        iconOnly
                        disabled={processing}
                        className={
                            email.starred ? 'emailInbox__star is-starred' : 'emailInbox__star'
                        }
                        title={email.starred ? 'Remover estrela' : 'Adicionar estrela'}
                        aria-label={`${email.starred ? 'Remover estrela de' : 'Adicionar estrela a'} ${email.subject}`}
                        leftIconClass={email.starred ? 'fa fa-star' : 'fa fa-star-o'}
                        onClick={() => onStar(email)}
                    />
                    <EmailDeliveryIndicator email={email.delivery} label={email.purpose_label} />
                    {email.label ? (
                        <i
                            className="fa fa-circle emailInbox__marker"
                            style={{ color: email.label_color ?? undefined }}
                            aria-label={`Marcador ${email.label_label}`}
                        />
                    ) : null}
                </div>
            ),
        },
        {
            id: 'recipient',
            label: 'Correspondente',
            width: '23%',
            cellTitle: (email) => email.correspondent_email || 'Sem endereço',
            render: (email) => (
                <Link href={destination(email)}>
                    <span className="emailInbox__muted">
                        {email.direction === 'incoming' ? 'De: ' : 'Para: '}
                    </span>
                    {email.correspondent_name || email.correspondent_email || 'Sem endereço'}
                </Link>
            ),
        },
        {
            id: 'message',
            label: 'Mensagem',
            width: '43%',
            render: (email) => (
                <Link href={destination(email)} className="emailInbox__messageLink">
                    <span className="emailInbox__subject">{email.subject || '(Sem assunto)'}</span>
                    <span className="emailInbox__preview">
                        {' '}
                        — {email.preview || email.purpose_label}
                    </span>
                </Link>
            ),
            cellTitle: (email) => [email.subject, email.preview].filter(Boolean).join(' — '),
        },
        {
            id: 'attachment',
            label: 'Anexos',
            hideLabel: true,
            width: '4%',
            render: (email) =>
                email.has_attachments ? (
                    <i className="fa fa-paperclip" aria-label="Com anexos" />
                ) : null,
        },
        {
            id: 'created_at',
            label: 'Data',
            fixed: 'end',
            width: '13%',
            cellClassName: 'emailInbox__date',
            render: (email) => email.created_at_label || 'Sem data',
        },
        {
            id: 'status',
            label: 'Status',
            defaultVisible: false,
            render: (email) => (
                <TableLabel tone={emailStatusTones[email.delivery.status]}>
                    {email.delivery.label}
                </TableLabel>
            ),
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
    ];
}

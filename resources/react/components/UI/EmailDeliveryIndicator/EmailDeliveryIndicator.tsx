import Tooltip from '@/components/UI/Tooltip/Tooltip';
import { emailDeliveryIcons } from './EmailDeliveryIndicator.data';
import type { EmailDeliverySummary } from './EmailDeliveryIndicator.types';
import './EmailDeliveryIndicator.css';

export default function EmailDeliveryIndicator({
    email,
    label,
}: {
    email: EmailDeliverySummary;
    label: string;
}): React.JSX.Element {
    const sentAt = email.sent_at_label ? ` em ${email.sent_at_label}` : '';
    let description = email.label;
    if (email.status === 'sent') {
        description = `${email.label}${sentAt}. A mensagem foi aceita pelo serviço de e-mail; a chegada à caixa de entrada não é confirmada.`;
    } else if (email.status === 'bounced') {
        description = `${email.label}. O Gmail retornou uma rejeição definitiva para esta mensagem. Confira o endereço do destinatário. Não haverá reenvio automático.`;
    } else if (email.status === 'not_sent') {
        description = `${email.label}. O envio real pode estar desativado ou a mensagem foi interrompida.`;
    } else if (email.status === 'unconfirmed') {
        description = `${email.label}. O processamento foi interrompido sem confirmação. A mensagem não será reenviada automaticamente para evitar duplicidade.`;
    }
    const information = `${label}: ${description}`;

    return (
        <Tooltip text={information}>
            <button
                type="button"
                className="emailDeliveryIndicator"
                data-status={email.status}
                title={information}
                aria-label={information}
            >
                <i className={emailDeliveryIcons[email.status]} aria-hidden="true" />
            </button>
        </Tooltip>
    );
}

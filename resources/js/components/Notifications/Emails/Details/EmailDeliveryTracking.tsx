import { Accordion } from '@/components/Navigation/Tabs/Tabs';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import { emailStatusDescriptions } from '../Emails.constants';
import type { EmailDetails } from '../Emails.types';
import { EMAIL_TOUR_TARGETS } from '../emailTours';

export default function EmailDeliveryTracking({
    email,
    tourEnabled,
}: {
    email: EmailDetails;
    tourEnabled: boolean;
}): React.JSX.Element {
    const title =
        email.direction === 'incoming'
            ? 'Detalhes da resposta recebida'
            : 'Detalhes e resultado do envio';

    return (
        <div
            className="emailInbox__tracking"
            data-tour={tourEnabled ? EMAIL_TOUR_TARGETS.tracking : undefined}
        >
            <Accordion
                headingLevel={3}
                items={[
                    {
                        id: `email-tracking-${email.id}`,
                        title,
                        content: (
                            <>
                                <DetailGrid>
                                    <DetailField label="Destinatário">
                                        {email.recipient_name ||
                                            email.recipient_email ||
                                            'Não informado'}
                                    </DetailField>
                                    <DetailField label="Origem">{email.context_label}</DetailField>
                                    <DetailField label="Finalidade">
                                        {email.purpose_label}
                                    </DetailField>
                                    {email.direction !== 'incoming' ? (
                                        <DetailField label="Tentativas">
                                            {email.attempts}
                                        </DetailField>
                                    ) : null}
                                    <DetailField
                                        label={
                                            email.direction === 'incoming'
                                                ? 'Recebido no Gnai em'
                                                : 'Registrado em'
                                        }
                                    >
                                        {email.created_at_label || 'Não informado'}
                                    </DetailField>
                                    {email.direction !== 'incoming' ? (
                                        <DetailField label="Última tentativa">
                                            {email.last_attempt_at_label ||
                                                'Sem tentativa registrada'}
                                        </DetailField>
                                    ) : null}
                                    {email.direction !== 'incoming' ? (
                                        <DetailField label="Enviado em">
                                            {email.delivery.sent_at_label || 'Sem envio confirmado'}
                                        </DetailField>
                                    ) : null}
                                    {email.bounce_status ? (
                                        <DetailField label="Código da rejeição">
                                            {email.bounce_status}
                                        </DetailField>
                                    ) : null}
                                </DetailGrid>
                                {email.rejections.length > 0 ? (
                                    <DetailGrid>
                                        {email.rejections.map((rejection) => (
                                            <DetailField
                                                key={rejection.recipient}
                                                label={`Rejeição: ${rejection.recipient}`}
                                            >
                                                {rejection.code}
                                            </DetailField>
                                        ))}
                                    </DetailGrid>
                                ) : null}
                                <InlineAlert variant="info">
                                    {emailStatusDescriptions[email.delivery.status]}
                                </InlineAlert>
                            </>
                        ),
                    },
                ]}
            />
        </div>
    );
}

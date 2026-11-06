import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { emailUrls } from '../Emails.routes';
import type { EmailDetails } from '../Emails.types';

export default function EmailDetailsActions({
    email,
    canSend,
}: {
    email: EmailDetails;
    canSend: boolean;
}): React.JSX.Element {
    const draft = email.delivery.status === 'draft';

    return (
        <FormActions>
            <Button href={emailUrls.index} label="Voltar" title="Voltar à Inbox" tone="cancel" />
            {canSend && draft ? (
                <Button
                    href={emailUrls.draft(email.id)}
                    tone="save"
                    label="Continuar rascunho"
                    title="Continuar rascunho"
                />
            ) : null}
            {canSend && !draft ? (
                <>
                    <Button
                        href={emailUrls.respond(email.id, 'reply')}
                        tone="white"
                        label="Responder"
                        title="Escrever resposta aos destinatários"
                        leftIconClass="fa fa-reply"
                    />
                    <Button
                        href={emailUrls.respond(email.id, 'forward')}
                        tone="primary"
                        label="Encaminhar"
                        title="Encaminhar mensagem"
                        leftIconClass="fa fa-share"
                    />
                </>
            ) : null}
        </FormActions>
    );
}

import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import type { AlertVariant } from '@/components/UI/InlineAlert/InlineAlert.types';
import type { MailSettingsProps } from '../Settings.types';

interface StatusContent {
    title: string;
    iconClass: string;
    variant: AlertVariant;
}

function formatTestedAt(value: string | null): string | null {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date);
}

function statusContent(mail: MailSettingsProps['mail']): StatusContent {
    const testedAt = formatTestedAt(mail.last_tested_at);
    const testedWhen = testedAt ? ` em ${testedAt}` : '';

    if (mail.transport === 'log') {
        return {
            title: 'Envio de e-mails desativado',
            iconClass: 'fa fa-file-text-o',
            variant: 'info',
        };
    }

    if (!mail.username || !mail.has_application_key) {
        return {
            title: 'Configuração incompleta',
            iconClass: 'fa fa-exclamation-circle',
            variant: 'danger',
        };
    }

    if (mail.test_status === 'success') {
        return {
            title: `Envio confirmado no último teste${testedWhen}`,
            iconClass: 'fa fa-check-circle',
            variant: 'success',
        };
    }

    if (mail.test_status === 'failed') {
        return {
            title: `Falha no último teste${testedWhen}`,
            iconClass: 'fa fa-times-circle',
            variant: 'danger',
        };
    }

    return {
        title: 'Envio ainda não verificado',
        iconClass: 'fa fa-clock-o',
        variant: 'warning',
    };
}

/** Identifica a configuração efetiva sem expor a chave de aplicativo armazenada. */
export default function MailConfigurationStatus({
    mail,
}: Pick<MailSettingsProps, 'mail'>): React.JSX.Element {
    const content = statusContent(mail);
    const account = mail.username || 'Não informado';
    const applicationKey = mail.has_application_key ? 'Cadastrada' : 'Não cadastrada';

    return (
        <InlineAlert variant={content.variant} className="mailSettings__configurationStatus">
            <div className="mailSettings__configurationStatusHeading">
                <i className={content.iconClass} aria-hidden="true" />
                <strong>{content.title}</strong>
            </div>
            <dl className="mailSettings__configurationDetails">
                <div>
                    <dt>Usuário de autenticação</dt>
                    <dd>{account}</dd>
                </div>
                <div>
                    <dt>Chave de aplicativo</dt>
                    <dd>{applicationKey}</dd>
                </div>
                <div>
                    <dt>Remetente exibido</dt>
                    <dd>
                        {mail.from_name} &lt;{mail.from_address}&gt;
                    </dd>
                </div>
            </dl>
        </InlineAlert>
    );
}

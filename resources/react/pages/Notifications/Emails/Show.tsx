import FormActions from '@/components/Forms/FormActions/FormActions';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import EmailDetails from '@/components/Notifications/Emails/Details/EmailDetails';
import { emailBreadcrumb, emailUrls } from '@/components/Notifications/Emails/Emails.routes';
import type { EmailShowProps } from '@/components/Notifications/Emails/Emails.types';
import { emailDetailsTour } from '@/components/Notifications/Emails/emailTours';
import Button from '@/components/UI/Button/Button';
import { useEmailDeliveryPolling } from '@/components/UI/EmailDeliveryIndicator/useEmailDeliveryPolling';

export default function EmailShow({ email }: EmailShowProps): React.JSX.Element {
    useEmailDeliveryPolling(['queued', 'processing'].includes(email.delivery.status), 'email');

    return (
        <BusinessPage
            title="Visualizar e-mail"
            documentTitle={email.subject}
            breadcrumbItems={emailBreadcrumb('Visualizar')}
            tour={emailDetailsTour}
        >
            <EmailDetails email={email} />
            <FormActions>
                <Button
                    href={emailUrls.index}
                    label="Voltar"
                    title="Voltar à Central de E-mails"
                    tone="cancel"
                />
            </FormActions>
        </BusinessPage>
    );
}

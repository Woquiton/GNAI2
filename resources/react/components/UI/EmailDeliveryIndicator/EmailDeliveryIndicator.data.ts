import type { EmailDeliveryStatus } from './EmailDeliveryIndicator.types';

/** Ícones distintos para que o resultado não dependa apenas da cor. */
export const emailDeliveryIcons: Record<EmailDeliveryStatus, string> = {
    not_requested: 'fa fa-question-circle',
    queued: 'fa fa-clock-o',
    processing: 'fa fa-paper-plane',
    sent: 'fa fa-envelope',
    failed: 'fa fa-exclamation-circle',
    unconfirmed: 'fa fa-question-circle',
    no_email: 'fa fa-ban',
    not_sent: 'fa fa-envelope-o',
};

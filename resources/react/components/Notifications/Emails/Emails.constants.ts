import type { TableLabelTone } from '@/components/UI/TableLabel/TableLabel';
import type { EmailFilters, EmailStatus } from './Emails.types';

export const emptyEmailFilters: EmailFilters = {
    search: '',
    status: '',
    context: '',
    date_from: '',
    date_to: '',
};

export const EMAIL_INBOX_COLLECTIONS = ['emails', 'counts'];

export const emailStatusTones: Record<EmailStatus, TableLabelTone> = {
    queued: 'warning',
    processing: 'info',
    sent: 'info',
    bounced: 'danger',
    failed: 'danger',
    no_email: 'inverse',
    not_sent: 'inverse',
    unconfirmed: 'warning',
};

export const emailStatusDescriptions: Record<EmailStatus, string> = {
    queued: 'A mensagem aguarda processamento ou uma nova tentativa de envio.',
    processing: 'O serviço está processando esta mensagem.',
    sent: 'O serviço de e-mail aceitou a mensagem. Isso não confirma a chegada à caixa de entrada ou a leitura.',
    bounced: 'O Gmail retornou uma rejeição definitiva. Confira o endereço do destinatário. Esta mensagem não será reenviada automaticamente.',
    failed: 'Não foi possível concluir o envio. As tentativas disponíveis se esgotaram ou houve falha no enfileiramento.',
    no_email: 'O destinatário não tinha um endereço de e-mail válido no momento do registro.',
    not_sent: 'O envio real estava desativado ou o processamento da mensagem foi interrompido.',
    unconfirmed: 'O processamento foi interrompido sem confirmação. Não haverá reenvio automático, para evitar mensagens duplicadas.',
};

import type { TableLabelTone } from '@/components/UI/TableLabel/TableLabel';
import type { EmailFilters, EmailStatus } from './Emails.types';

export const emptyEmailFilters: EmailFilters = {
    search: '',
    status: '',
    context: '',
    date_from: '',
    date_to: '',
    folder: 'all',
    label: '',
};

export const EMAIL_INBOX_COLLECTIONS = ['emails', 'counts', 'mailbox'];
export const EMAIL_THREAD_COLLECTIONS = ['email', 'thread'];

export const emailStatusTones: Record<EmailStatus, TableLabelTone> = {
    queued: 'warning',
    draft: 'inverse',
    received: 'primary',
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
    draft: 'Esta mensagem ainda não foi enviada. Abra o rascunho para continuar a escrita.',
    received:
        'Resposta importada do Gmail e vinculada a uma mensagem do Gnai. A leitura é pessoal. Com a sincronização de pastas ativa, mover a mensagem também altera o Gmail da instituição.',
    processing: 'O serviço está processando esta mensagem.',
    sent: 'O serviço de e-mail aceitou a mensagem. Isso não confirma a chegada à caixa de entrada ou a leitura.',
    bounced:
        'O Gmail retornou uma rejeição definitiva para pelo menos um destinatário. Confira os endereços. Esta mensagem não será reenviada automaticamente.',
    failed: 'Não foi possível concluir o envio. As tentativas disponíveis se esgotaram ou houve falha no enfileiramento.',
    no_email: 'O destinatário não tinha um endereço de e-mail válido no momento do registro.',
    not_sent: 'O envio real estava desativado ou o processamento da mensagem foi interrompido.',
    unconfirmed:
        'O processamento foi interrompido sem confirmação. Não haverá reenvio automático, para evitar mensagens duplicadas.',
};

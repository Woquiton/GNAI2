import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import { caseStudyDeleteMessage } from './CaseStudies.constants';

interface CaseStudyDeleteModalProps {
    open: boolean;
    /** Nome do registro escolhido ("Estudo de Caso v2 de Maria"), exibido abaixo da pergunta. */
    name?: string | null;
    /** Pergunta da confirmação; as listagens usam a mensagem padrão. */
    message?: string;
    processing: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/** Confirmação de exclusão compartilhada pelas listagens e pela visualização. */
export default function CaseStudyDeleteModal({
    open,
    name,
    message = caseStudyDeleteMessage,
    processing,
    onClose,
    onConfirm,
}: CaseStudyDeleteModalProps): React.JSX.Element {
    return (
        <ConfirmActionModal
            open={open}
            title="Excluir Estudo de Caso"
            message={message}
            details={name ? <strong>{name}</strong> : undefined}
            processing={processing}
            confirmLabel="Confirmar exclusão"
            processingLabel="Excluindo Estudo de Caso..."
            confirmTone="dark-red"
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}

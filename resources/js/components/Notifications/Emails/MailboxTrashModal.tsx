import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import type { useMailboxActions } from './useMailboxActions';

export default function MailboxTrashModal({
    actions,
    folderSyncEnabled = false,
}: {
    actions: ReturnType<typeof useMailboxActions>;
    folderSyncEnabled?: boolean;
}): React.JSX.Element {
    const quantity = actions.trashIds.length;
    const destination = folderSyncEnabled
        ? 'a lixeira compartilhada, também no Gmail'
        : 'a sua lixeira';
    const message = `Mover ${quantity} ${quantity === 1 ? 'mensagem' : 'mensagens'} para ${destination}?`;
    const details = folderSyncEnabled
        ? 'As mensagens vinculadas serão movidas também no Gmail da instituição. O histórico no Gnai será preservado. A ação não cancela envios já iniciados.'
        : 'Os registros serão preservados e poderão ser restaurados. Mover para a lixeira não cancela envios já iniciados.';

    return (
        <ConfirmActionModal
            open={actions.trashIds.length > 0}
            title="Mover para a lixeira"
            message={message}
            details={details}
            processing={actions.processing}
            confirmLabel="Mover para a lixeira"
            processingLabel="Movendo..."
            onClose={actions.closeTrash}
            onConfirm={actions.confirmTrash}
        />
    );
}

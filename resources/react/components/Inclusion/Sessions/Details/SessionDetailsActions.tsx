import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { sessionUrls } from '../Sessions.routes';
import type { SessionDetailsPermissions, SessionShowRecord } from '../Sessions.types';

interface SessionDetailsActionsProps {
    sessionId: number;
    record: SessionShowRecord | null;
    permissions: SessionDetailsPermissions;
    backUrl: string;
    busy: boolean;
    onCancel: () => void;
    onDelete: () => void;
}

/**
 * Rodapé fixo da visualização: PDF pedagógico à esquerda; voltar, editar, cancelar, registro de
 * atendimento e excluir ao centro.
 */
export default function SessionDetailsActions({
    sessionId,
    record,
    permissions,
    backUrl,
    busy,
    onCancel,
    onDelete,
}: SessionDetailsActionsProps): React.JSX.Element {
    const isAee = record?.kind === 'aee';
    const showRecordLabel = isAee ? 'Ver Atendimento AEE' : 'Ver Atendimento Pedagógico';
    const createRecordLabel = isAee ? 'Criar Atendimento AEE' : 'Criar Registro Pedagógico';
    const pdfAction = record?.pdf_url ? (
        <Button
            href={record.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            tone="dark-red"
            leftIconClass="fa fa-file-pdf-o"
            label="PDF Pedagógico"
            title="Exportar atendimento pedagógico em PDF"
            aria-label="Exportar atendimento pedagógico em PDF"
        />
    ) : undefined;

    return (
        <FormActions secondary={pdfAction}>
            <Button
                href={backUrl}
                tone="cancel"
                label="Voltar"
                title="Voltar para agendamentos"
                aria-label="Voltar para agendamentos"
                disabled={busy}
            />
            {permissions.edit ? (
                <Button
                    href={sessionUrls.edit(sessionId)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar agendamento"
                    aria-label="Editar agendamento"
                />
            ) : null}
            {permissions.cancel ? (
                <Button
                    tone="inverse"
                    leftIconClass="fa fa-ban"
                    label="Cancelar Agendamento"
                    title="Cancelar agendamento"
                    aria-label="Cancelar agendamento"
                    disabled={busy}
                    onClick={onCancel}
                />
            ) : null}
            {record?.show_url ? (
                <Button
                    href={record.show_url}
                    tone="info"
                    leftIconClass="fa fa-eye"
                    label={showRecordLabel}
                />
            ) : null}
            {record?.create_url ? (
                <Button
                    href={record.create_url}
                    tone="success"
                    leftIconClass="fa fa-plus"
                    label={createRecordLabel}
                />
            ) : null}
            {permissions.delete ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir agendamento"
                    aria-label="Excluir agendamento"
                    disabled={busy}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

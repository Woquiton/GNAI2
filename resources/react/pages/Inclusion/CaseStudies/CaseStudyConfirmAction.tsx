import type { ReactNode } from "react";
import { useTableListAction } from "@/components/Tables/TableList/TableList";
import Button, { type ButtonTone } from "@/components/UI/Button/Button";
import ConfirmActionModal from "@/components/UI/ConfirmActionModal/ConfirmActionModal";

/** Ação do rodapé do Estudo de Caso que conclui ou exclui, sempre confirmada antes do envio. */
export default function CaseStudyConfirmAction({
    method,
    action,
    label,
    ariaLabel,
    tone,
    iconClass,
    modalTitle,
    message,
    confirmLabel,
    processingLabel,
    failureText,
}: {
    method: "delete" | "patch";
    action: string;
    label: string;
    ariaLabel: string;
    tone: ButtonTone;
    iconClass: string;
    modalTitle: string;
    message: ReactNode;
    confirmLabel: string;
    processingLabel: string;
    failureText: string;
}): React.JSX.Element {
    const request = useTableListAction<true>({ failureText });

    return (
        <>
            <Button
                type="button"
                tone={tone}
                leftIconClass={iconClass}
                label={label}
                title={ariaLabel}
                aria-label={ariaLabel}
                disabled={request.processing}
                onClick={() => request.open(true)}
            />
            <ConfirmActionModal
                open={request.target !== null}
                title={modalTitle}
                message={message}
                processing={request.processing}
                confirmLabel={confirmLabel}
                processingLabel={processingLabel}
                confirmTone={tone}
                onClose={request.close}
                onConfirm={() => request.submit(method, action)}
            />
        </>
    );
}

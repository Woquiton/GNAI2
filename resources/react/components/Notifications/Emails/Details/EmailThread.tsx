import { useEffect, useRef } from 'react';
import Button from '@/components/UI/Button/Button';
import { emailUrls } from '../Emails.routes';
import type { EmailDetails as EmailMessage } from '../Emails.types';
import { EMAIL_TOUR_TARGETS } from '../emailTours';
import EmailDetails from './EmailDetails';
import './EmailThread.css';

export default function EmailThread({
    messages,
    selectedId,
    canSend,
}: {
    messages: EmailMessage[];
    selectedId: string;
    canSend: boolean;
}): React.JSX.Element {
    const selectedMessage = useRef<HTMLLIElement>(null);
    const countLabel = messages.length === 1 ? '1 mensagem' : `${messages.length} mensagens`;

    useEffect(() => {
        // Aguarda a navegação terminar de reposicionar a página antes de mostrar o contexto.
        const frame = window.requestAnimationFrame(() => {
            selectedMessage.current?.focus({ preventScroll: true });
            selectedMessage.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
        });

        return () => window.cancelAnimationFrame(frame);
    }, [selectedId]);

    return (
        <section
            className="emailThread"
            aria-label="Conversa por e-mail"
            data-tour={EMAIL_TOUR_TARGETS.thread}
        >
            <p className="emailThread__summary emailInbox__muted">
                {countLabel} na conversa, da mais antiga para a mais recente.
            </p>
            <ol className="emailThread__messages" role="list">
                {messages.map((message, index) => {
                    const selected = message.id === selectedId;
                    const canReply = canSend && message.delivery.status !== 'draft';

                    return (
                        <li
                            key={message.id}
                            ref={selected ? selectedMessage : undefined}
                            tabIndex={selected ? -1 : undefined}
                            aria-current={selected ? 'true' : undefined}
                        >
                            <div className="emailThread__messageCaption">
                                <span>Mensagem {index + 1}</span>
                                {selected ? <strong>Mensagem selecionada</strong> : null}
                            </div>
                            <EmailDetails email={message} tourEnabled={selected} />
                            {canReply ? (
                                <div className="emailThread__messageActions">
                                    <Button
                                        href={emailUrls.respond(message.id, 'reply')}
                                        label="Responder a esta mensagem"
                                        title={`Responder à mensagem ${index + 1} no editor completo`}
                                        tone="white"
                                        leftIconClass="fa fa-reply"
                                    />
                                    <Button
                                        href={emailUrls.respond(message.id, 'forward')}
                                        label="Encaminhar"
                                        title={`Encaminhar a mensagem ${index + 1}`}
                                        tone="white"
                                        leftIconClass="fa fa-share"
                                    />
                                </div>
                            ) : null}
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}

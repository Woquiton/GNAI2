import { useEffect, useRef, type Key, type ReactNode } from 'react';
import { useCustomScrollbar } from '@/hooks/useCustomScrollbar';
import { animateElementScrollTop } from '@/utils/animateElementScrollTop';
import { joinClassNames } from '@/utils/joinClassNames';
import './ChatConversation.css';

export interface ChatConversationMessage {
    id: Key;
    author: string;
    /** Complemento curto ao lado do autor, como o papel de quem escreveu. */
    meta?: string;
    /** Texto simples; as quebras de linha são preservadas. */
    text: string;
    time: string;
    avatarUrl?: string | null;
    /** Mensagem do usuário atual, exibida do lado oposto como no chat do Ubold. */
    own?: boolean;
}

interface ChatConversationProps {
    /** Nome da conversa para leitores de tela. */
    label: string;
    messages: ChatConversationMessage[];
    emptyMessage: string;
    /** Formulário de envio: à direita da conversa quando há largura, abaixo dela quando não há. */
    composer?: ReactNode;
    className?: string;
}

const DEFAULT_AVATAR = '/images/default-user.jpg';

/**
 * Conversa no formato do chat do Ubold (Dashboard 2): altura fixa com rolagem interna, a mensagem
 * mais recente embaixo e o envio ao lado (ou na base, em espaços estreitos). Muitas mensagens não alongam a página. Ao montar, a
 * conversa já mostra o fim; quando chega uma mensagem nova, rola até ela.
 */
export default function ChatConversation({
    label,
    messages,
    emptyMessage,
    composer,
    className,
}: ChatConversationProps): React.JSX.Element {
    const { scrollRef, thumbHeight, thumbTop, isVisible } =
        useCustomScrollbar<HTMLDivElement>(true);
    const previousCount = useRef<number | null>(null);

    useEffect(() => {
        const element = scrollRef.current;
        if (!element) return undefined;

        const target = element.scrollHeight;
        const isNewMessage =
            previousCount.current !== null && messages.length > previousCount.current;
        previousCount.current = messages.length;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!isNewMessage || reducedMotion) {
            element.scrollTop = target;
            return undefined;
        }

        return animateElementScrollTop(element, target);
    }, [messages.length, scrollRef]);

    return (
        <div className={joinClassNames('chatConversation', className)}>
            <div className="chatConversation__layout">
                <div className="chatConversation__pane">
                    <div
                        ref={scrollRef}
                        className="chatConversation__scroll"
                        role="log"
                        aria-label={label}
                        // Rolável pelo teclado, já que a barra nativa fica oculta.
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                        tabIndex={0}
                    >
                        {messages.length ? (
                            <ul className="chatConversation__list">
                                {messages.map((message) => (
                                    <li
                                        key={message.id}
                                        className={joinClassNames(
                                            'chatConversation__message',
                                            message.own && 'chatConversation__message--own',
                                        )}
                                    >
                                        <div className="chatConversation__avatar">
                                            <img src={message.avatarUrl || DEFAULT_AVATAR} alt="" />
                                        </div>
                                        <div className="chatConversation__bubble">
                                            <p className="chatConversation__author">
                                                <strong>{message.author}</strong>
                                                {message.meta ? (
                                                    <span className="chatConversation__meta">
                                                        {' '}
                                                        ({message.meta})
                                                    </span>
                                                ) : null}
                                            </p>
                                            <p className="chatConversation__text">{message.text}</p>
                                            <p className="chatConversation__time">{message.time}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="chatConversation__empty">{emptyMessage}</p>
                        )}
                    </div>
                    <div
                        className={joinClassNames(
                            'chatConversation__scrollbar',
                            isVisible && thumbHeight > 0 && 'chatConversation__scrollbar--visible',
                        )}
                        aria-hidden="true"
                    >
                        <div
                            className="chatConversation__thumb"
                            style={{
                                height: `${thumbHeight}px`,
                                transform: `translateY(${thumbTop}px)`,
                            }}
                        />
                    </div>
                </div>
                {composer ? <div className="chatConversation__composer">{composer}</div> : null}
            </div>
        </div>
    );
}

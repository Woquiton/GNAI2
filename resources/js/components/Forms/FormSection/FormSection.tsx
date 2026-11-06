import { useId, type ReactNode } from 'react';
import CardBox from '@/components/UI/CardBox/CardBox';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import '@styles/components/Forms/FormSection/FormSection.css';

interface FormSectionProps {
    id?: string;
    title: string;
    titleAddon?: ReactNode;
    /**
     * Texto de apoio da seção. Texto simples vai para o tooltip de informação ao lado do título;
     * conteúdo formatado (com código ou links) continua como parágrafo abaixo dele.
     */
    description?: ReactNode;
    children: ReactNode;
    variant?: 'card' | 'inline';
    iconClass?: string;
    /** Valor de `data-tour`, para o tutorial ao vivo destacar o componente. */
    tourTarget?: string;
}
export default function FormSection({
    id,
    title,
    titleAddon,
    description,
    children,
    variant = 'card',
    iconClass = 'fa fa-list-alt',
    tourTarget,
}: FormSectionProps): React.JSX.Element {
    const generatedId = useId();
    const titleId = `${id ?? generatedId}-title`;
    const Heading = variant === 'inline' ? 'h2' : 'h4';
    const content = (
        <>
            <Heading id={titleId} className="formSection__title">
                <i className={iconClass} aria-hidden="true" />
                <span>{title}</span>
                {titleAddon}
                {typeof description === 'string' && description ? (
                    <InfoTooltip
                        text={description}
                        label={`Mais informações sobre ${title.toLowerCase()}`}
                    />
                ) : null}
            </Heading>
            {description && typeof description !== 'string' ? (
                <p className="formSection__description">{description}</p>
            ) : null}
            {children}
        </>
    );
    return variant === 'inline' ? (
        <section
            id={id}
            aria-labelledby={titleId}
            className="formSection formSection--inline"
            data-tour={tourTarget}
        >
            {content}
        </section>
    ) : (
        <CardBox className="formSection" tourTarget={tourTarget}>
            {content}
        </CardBox>
    );
}

export function FormDemoDescription(): React.JSX.Element {
    return (
        <>
            Use as classes de botão em um elemento <code>&lt;a&gt;</code>,{' '}
            <code>&lt;button&gt;</code> ou <code>&lt;input&gt;</code>.
        </>
    );
}

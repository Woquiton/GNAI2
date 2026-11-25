import { policyDocuments } from '@/components/Policies/Policies.constants';
import type { PolicyKey } from '@/components/Policies/Policies.types';
import '@styles/components/Navigation/PolicyLinks/PolicyLinks.css';

export default function PolicyLinks({
    preview = false,
    variant = 'footer',
    activePolicy,
}: {
    preview?: boolean;
    variant?: 'footer' | 'navigation';
    activePolicy?: PolicyKey;
}): React.JSX.Element {
    return (
        <nav
            id={variant === 'navigation' ? 'politicas-navegacao' : undefined}
            className={`policyLinks policyLinks--${variant}`}
            aria-label="Privacidade e políticas do Gnai"
            tabIndex={variant === 'navigation' ? -1 : undefined}
        >
            <ul>
                {policyDocuments.map((document) => (
                    <li key={document.key}>
                        <a
                            href={document.href}
                            aria-current={activePolicy === document.key ? 'page' : undefined}
                            onClick={preview ? (event) => event.preventDefault() : undefined}
                        >
                            {document.title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

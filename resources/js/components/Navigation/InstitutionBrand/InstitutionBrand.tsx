import { Link } from '@inertiajs/react';
import '@styles/components/Navigation/InstitutionBrand/InstitutionBrand.css';

export default function InstitutionBrand({
    name,
    href,
}: {
    name: string;
    href?: string;
}): React.JSX.Element {
    return href ? (
        <Link
            className="institutionBrand"
            href={href}
            title={name}
            aria-label={`Gerenciar instituição: ${name}`}
        >
            {name}
        </Link>
    ) : (
        <span className="institutionBrand" title={name}>
            {name}
        </span>
    );
}

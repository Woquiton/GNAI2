import { joinClassNames } from '@/utils/joinClassNames';
import '@styles/components/UI/SweetAlertWarningIcon/SweetAlertWarningIcon.css';

/**
 * "!" de aviso do SweetAlert, com a cor pulsando. Entra com um pequeno salto e, com `leaving`,
 * sai ao contrário. Decorativo: o texto ao lado comunica o aviso.
 */
export default function SweetAlertWarningIcon({
    className,
    leaving = false,
}: {
    className?: string;
    leaving?: boolean;
}): React.JSX.Element {
    return (
        <span
            className={joinClassNames(
                'sweetAlertWarningIcon',
                leaving && 'sweetAlertWarningIcon--leaving',
                className,
            )}
            aria-hidden="true"
        >
            <span className="sweetAlertWarningIcon__body" />
            <span className="sweetAlertWarningIcon__dot" />
        </span>
    );
}

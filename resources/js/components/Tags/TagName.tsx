import Tooltip from '@/components/UI/Tooltip/Tooltip';
import '@styles/components/Tags/TagName.css';

export default function TagName({
    name,
    special = false,
}: {
    name: string;
    special?: boolean;
}): React.JSX.Element {
    return (
        <span className="tagName">
            {name}
            {special ? (
                <Tooltip text="Etiqueta Especial">
                    <span
                        className="tagName__specialIcon"
                        tabIndex={0}
                        role="img"
                        aria-label="Etiqueta Especial"
                    >
                        <i className="fa fa-star" aria-hidden="true" />
                    </span>
                </Tooltip>
            ) : null}
        </span>
    );
}

import Tooltip from '@/components/UI/Tooltip/Tooltip';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { badgeColors } from '@/utils/badgeColors';
import '@styles/components/Tags/TagName.css';

export default function TagName({
    name,
    color,
    special = false,
}: {
    name: string;
    color?: string;
    special?: boolean;
}): React.JSX.Element {
    const badge = badgeColors(color);

    const content = (
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
    return badge ? <TableLabel style={badge}>{content}</TableLabel> : content;
}

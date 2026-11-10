interface Props {
    label: string;
    icon: string;
    active: boolean;
    value?: string;
    expanded?: boolean;
    controls?: string;
    onClick: () => void;
}

export default function SiteAccessibilityTool({
    label,
    icon,
    active,
    value,
    expanded,
    controls,
    onClick,
}: Props): React.JSX.Element {
    const state = value ?? (active ? 'Ativado' : 'Desativado');

    return (
        <button
            type="button"
            className={'siteAccessibility__tool' + (active ? ' is-active' : '')}
            aria-pressed={expanded === undefined ? active : undefined}
            aria-expanded={expanded}
            aria-controls={controls}
            title={label + ': ' + state}
            onClick={onClick}
        >
            <i className={icon + ' siteAccessibility__toolIcon'} aria-hidden="true" />
            <span className="siteAccessibility__toolLabel">{label}</span>
            <span
                className="siteAccessibility__toolState"
                role={value !== undefined ? 'status' : undefined}
                aria-live={value !== undefined ? 'polite' : undefined}
                aria-atomic={value !== undefined ? true : undefined}
            >
                {state}
            </span>
            {active ? (
                <i className="fa fa-check siteAccessibility__selected" aria-hidden="true" />
            ) : null}
        </button>
    );
}

import { useId } from 'react';

/** Opções enumeradas ficam explícitas, sem exigir cliques para descobrir o próximo valor. */
export default function SiteAccessibilityChoice({
    label,
    icon,
    options,
    value,
    onChange,
}: {
    label: string;
    icon: string;
    options: string[];
    value: number;
    onChange: (value: number) => void;
}): React.JSX.Element {
    const id = useId();

    return (
        <div
            className={
                'siteAccessibility__tool siteAccessibility__choiceTool' +
                (value > 0 ? ' is-active' : '')
            }
        >
            <i className={icon + ' siteAccessibility__toolIcon'} aria-hidden="true" />
            <label className="siteAccessibility__toolLabel" htmlFor={id}>
                {label}
            </label>
            <select
                id={id}
                className="siteAccessibility__choice"
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
            >
                {options.map((option, index) => (
                    <option key={option} value={index}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

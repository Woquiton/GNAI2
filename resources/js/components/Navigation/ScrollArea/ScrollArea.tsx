import type { CSSProperties } from 'react';
import type { ScrollAreaProps } from './ScrollArea.types';
import { useScrollArea } from './useScrollArea';
import '@styles/components/Navigation/ScrollArea/ScrollArea.css';
export default function ScrollArea({
    children,
    height,
    maxHeight,
    className = '',
    label,
}: ScrollAreaProps): React.JSX.Element {
    const ref = useScrollArea();
    const style: CSSProperties = { height, maxHeight };
    return (
        <div
            ref={ref}
            className={`scrollArea ${className}`}
            style={style}
            role="region"
            aria-label={label}
        >
            {children}
        </div>
    );
}

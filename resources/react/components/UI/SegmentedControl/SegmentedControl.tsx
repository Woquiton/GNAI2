import Button from '@/components/UI/Button/Button';
import { joinClassNames } from '@/utils/joinClassNames';
import type { SegmentedControlProps } from './SegmentedControl.types';
import './SegmentedControl.css';

/** Seletor grafite do builder e da auditoria, com estado pressionado e foco compartilhados. */
export default function SegmentedControl<T extends string>({
    label,
    value,
    options,
    onChange,
    disabled = false,
    className,
    tourTarget,
}: SegmentedControlProps<T>): React.JSX.Element {
    return (
        <div
            className={joinClassNames('segmentedControl', className)}
            role="group"
            aria-label={label}
            data-tour={tourTarget}
        >
            {options.map((option) => (
                <Button
                    key={option.value}
                    size="sm"
                    tone="inverse"
                    className="segmentedControl__button"
                    leftIconClass={option.iconClass}
                    label={option.label}
                    title={option.label}
                    disabled={disabled}
                    aria-pressed={value === option.value}
                    aria-controls={option.controls}
                    onClick={() => onChange(option.value)}
                />
            ))}
        </div>
    );
}

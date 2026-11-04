export interface SegmentedControlOption<T extends string> {
    value: T;
    label: string;
    iconClass?: string;
    controls?: string;
}

export interface SegmentedControlProps<T extends string> {
    label: string;
    value: T;
    options: readonly SegmentedControlOption<T>[];
    onChange: (value: T) => void;
    disabled?: boolean;
    className?: string;
    tourTarget?: string;
}

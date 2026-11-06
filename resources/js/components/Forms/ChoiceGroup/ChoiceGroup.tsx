import type { ReactNode } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import '@styles/components/Forms/ChoiceGroup/ChoiceGroup.css';

export default function ChoiceGroup({
    id,
    label,
    children,
    invalid = false,
    describedBy,
    className,
}: {
    id?: string;
    label: string;
    children: ReactNode;
    invalid?: boolean;
    describedBy?: string;
    className?: string;
}): React.JSX.Element {
    return (
        // aria-invalid acompanha o estado visual do grupo; a mensagem é associada por aria-describedby.
        // eslint-disable-next-line jsx-a11y/role-supports-aria-props
        <div
            id={id}
            className={joinClassNames(
                'choiceGroup',
                invalid ? 'choiceGroup--invalid' : undefined,
                className,
            )}
            role="group"
            aria-label={label}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
        >
            {children}
        </div>
    );
}

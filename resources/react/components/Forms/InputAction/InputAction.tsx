import type { ReactNode } from 'react';
import TextInput, { type TextInputProps } from '@/components/Forms/TextInput/TextInput';
import Button from '@/components/UI/Button/Button';
import './InputAction.css';

export default function InputAction({
    label,
    action,
    button,
    buttonDisabled = false,
    ...inputProps
}: TextInputProps & {
    label?: string;
    action?: ReactNode;
    /** Botão próprio colado ao campo (`input-group-btn` do Ubold), sem a moldura do addon. */
    button?: ReactNode;
    buttonDisabled?: boolean;
}): React.JSX.Element {
    let addon: ReactNode = null;
    if (button !== undefined) {
        addon = button;
    } else if (action !== undefined) {
        addon = <span className="inputAction__addon">{action}</span>;
    } else if (label) {
        addon = (
            <Button type="submit" tone="pink" width="sm" label={label} disabled={buttonDisabled} />
        );
    }

    return (
        <div className="inputAction">
            <TextInput {...inputProps} />
            {addon}
        </div>
    );
}

import { useRef } from 'react';
import type { EditableFieldProps } from './EditableField.types';
import { useEditableField } from './useEditableField';
import '@styles/components/UI/EditableField/EditableField.plugin.css';
import '@styles/components/UI/EditableField/EditableField.base.css';
import '@styles/components/UI/EditableField/EditableField.css';

export default function EditableField(props: EditableFieldProps): React.JSX.Element {
    const host = useRef<HTMLSpanElement>(null);
    useEditableField(host, props);
    return <span className="editableField" ref={host} />;
}

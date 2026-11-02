import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import EmptyText from '@/components/UI/EmptyText/EmptyText';
import type { GroupedPositionPermissions, PositionPermission } from '../Positions.types';
import './PositionPermissionsFields.css';

interface PositionPermissionsFieldsProps {
    permissions: GroupedPositionPermissions;
    selected: readonly number[];
    error?: string;
    disabled: boolean;
    onToggle: (ids: number[], checked: boolean) => void;
}

function groupLabel(group: string): string {
    const label = group.replace(/-/g, ' ');

    return label.charAt(0).toLocaleUpperCase('pt-BR') + label.slice(1);
}

function groupSlug(group: string, index: number): string {
    const slug = group
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    return `${slug || 'grupo'}-${index}`;
}

interface PermissionGroupProps {
    group: string;
    index: number;
    items: PositionPermission[];
    selected: readonly number[];
    disabled: boolean;
    onToggle: (ids: number[], checked: boolean) => void;
}

/** Grupo de permissões de uma entidade com a opção "Selecionar Todas". */
function PermissionGroup({
    group,
    index,
    items,
    selected,
    disabled,
    onToggle,
}: PermissionGroupProps): React.JSX.Element {
    const slug = groupSlug(group, index);
    const label = groupLabel(group);
    const titleId = `position-group-${slug}-title`;
    const ids = items.map((permission) => permission.id);
    const allChecked = ids.length > 0 && ids.every((id) => selected.includes(id));

    return (
        <div className="positionPermissions__group" role="group" aria-labelledby={titleId}>
            <div className="positionPermissions__groupHeader">
                <h3 id={titleId} className="positionPermissions__groupTitle">
                    {label}
                </h3>
                <ChoiceControl
                    type="checkbox"
                    tone="purple"
                    id={`position-group-${slug}-all`}
                    label="Selecionar Todas"
                    aria-label={`Selecionar todas as permissões de ${label}`}
                    checked={allChecked}
                    disabled={disabled}
                    className="positionPermissions__checkAll"
                    onChange={(checked) => onToggle(ids, checked)}
                />
            </div>
            <div className="positionPermissions__groupBody">
                <FormGrid columns={4}>
                    {items.map((permission) => (
                        <ChoiceControl
                            key={permission.id}
                            type="checkbox"
                            tone="purple"
                            id={`position-permission-${permission.id}`}
                            name="permissions[]"
                            label={permission.name}
                            checked={selected.includes(permission.id)}
                            disabled={disabled}
                            className="positionPermissions__permission"
                            onChange={(checked) => onToggle([permission.id], checked)}
                        />
                    ))}
                </FormGrid>
            </div>
        </div>
    );
}

/** Permissões do cargo agrupadas por entidade. */
export default function PositionPermissionsFields({
    permissions,
    selected,
    error,
    disabled,
    onToggle,
}: PositionPermissionsFieldsProps): React.JSX.Element {
    const groups = Object.entries(permissions);
    const allIds = [...new Set(groups.flatMap(([, items]) => items.map((item) => item.id)))];
    const allChecked = allIds.length > 0 && allIds.every((id) => selected.includes(id));
    const content = groups.length ? (
        <div className="positionPermissions__groups">
            {groups.map(([group, items], index) => (
                <PermissionGroup
                    key={group}
                    group={group}
                    index={index}
                    items={items}
                    selected={selected}
                    disabled={disabled}
                    onToggle={onToggle}
                />
            ))}
        </div>
    ) : (
        <EmptyText>Nenhuma permissão cadastrada.</EmptyText>
    );

    return (
        <FormSection
            id="position-permissions"
            title="Permissões do Cargo"
            variant="inline"
            iconClass="fa fa-key"
        >
            {error ? (
                <p
                    id="position-permissions-error"
                    className="positionPermissions__error"
                    role="alert"
                >
                    {error}
                </p>
            ) : null}
            {allIds.length > 0 ? (
                <ChoiceControl
                    type="checkbox"
                    tone="purple"
                    id="position-permissions-all"
                    label="Selecionar todas as permissões"
                    checked={allChecked}
                    disabled={disabled}
                    className="positionPermissions__selectAll"
                    onChange={(checked) => onToggle(allIds, checked)}
                />
            ) : null}
            {content}
        </FormSection>
    );
}

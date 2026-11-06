import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import DropdownMenu from '@/components/Navigation/DropdownMenu/DropdownMenu';
import Button from '@/components/UI/Button/Button';
import type { EmailMailbox } from '../Emails.types';
import { EMAIL_TOUR_TARGETS } from '../emailTours';

export default function EmailToolbar({
    selected,
    allSelected,
    onSelectAll,
    processing,
    labels,
    folder,
    canMove = true,
    onOrganize,
    onRefresh,
}: {
    selected: number;
    allSelected?: boolean;
    onSelectAll?: (checked: boolean) => void;
    processing: boolean;
    labels: EmailMailbox['labels'];
    folder?: string;
    canMove?: boolean;
    onOrganize: (operation: string, label?: string | null) => void;
    onRefresh?: () => void;
}): React.JSX.Element {
    const moveItems = [
        { label: 'Arquivo', onSelect: () => onOrganize('archive') },
        { label: 'Spam', onSelect: () => onOrganize('spam') },
        { label: 'Lixeira', onSelect: () => onOrganize('trash') },
        { label: 'Restaurar à lista principal', onSelect: () => onOrganize('restore') },
    ];
    const labelItems = [
        ...Object.entries(labels)
            .filter(([, tag]) => tag.is_active)
            .map(([value, tag]) => ({
                label: tag.name,
                iconClass: 'fa fa-circle',
                iconColor: tag.color,
                onSelect: () => onOrganize('label', value),
            })),
        { label: 'Remover marcador', onSelect: () => onOrganize('label', null) },
    ];
    const moreItems = [
        { label: 'Marcar como lida', onSelect: () => onOrganize('read') },
        { label: 'Marcar como não lida', onSelect: () => onOrganize('unread') },
        { label: 'Adicionar estrela', onSelect: () => onOrganize('star') },
        { label: 'Remover estrela', onSelect: () => onOrganize('unstar') },
    ];

    return (
        <div
            className="emailInbox__toolbar"
            role="group"
            aria-label="Ações das mensagens"
            data-tour={EMAIL_TOUR_TARGETS.toolbar}
        >
            {onSelectAll ? (
                <ChoiceControl
                    id="email-select-all"
                    type="checkbox"
                    label="Selecionar todas"
                    checked={allSelected}
                    disabled={processing}
                    onChange={onSelectAll}
                    tone="purple"
                />
            ) : null}
            <fieldset
                disabled={processing || selected === 0}
                className="emailInbox__toolbarActions"
            >
                <legend className="emailInbox__sr">Organizar mensagens selecionadas</legend>
                <fieldset disabled={!canMove} className="emailInbox__toolbarActions">
                    <legend className="emailInbox__sr">Mover mensagens selecionadas</legend>
                    {folder === 'trash' ? (
                        <Button
                            tone="primary"
                            iconOnly
                            title="Restaurar"
                            aria-label="Restaurar mensagens selecionadas"
                            leftIconClass="fa fa-undo"
                            onClick={() => onOrganize('restore')}
                        />
                    ) : (
                        <>
                            <Button
                                tone="primary"
                                iconOnly
                                title="Arquivar"
                                aria-label="Arquivar mensagens selecionadas"
                                leftIconClass="fa fa-archive"
                                onClick={() => onOrganize('archive')}
                            />
                            <Button
                                tone="primary"
                                iconOnly
                                title="Mover para spam"
                                aria-label="Mover mensagens selecionadas para spam"
                                leftIconClass="fa fa-exclamation-circle"
                                onClick={() => onOrganize('spam')}
                            />
                            <Button
                                tone="primary"
                                iconOnly
                                title="Mover para a lixeira"
                                aria-label="Mover mensagens selecionadas para a lixeira"
                                leftIconClass="fa fa-trash-o"
                                onClick={() => onOrganize('trash')}
                            />
                        </>
                    )}
                    <DropdownMenu
                        label={<i className="fa fa-folder" aria-hidden="true" />}
                        accessibleLabel="Mover para pasta"
                        items={moveItems}
                    />
                </fieldset>
                <DropdownMenu
                    label={<i className="fa fa-tag" aria-hidden="true" />}
                    accessibleLabel="Aplicar marcador"
                    items={labelItems}
                />
                <DropdownMenu
                    label="Mais"
                    accessibleLabel="Mais ações de e-mail"
                    items={moreItems}
                />
            </fieldset>
            {onRefresh ? (
                <Button
                    tone="white"
                    iconOnly
                    leftIconClass="fa fa-refresh"
                    title="Atualizar"
                    aria-label="Atualizar e-mails"
                    disabled={processing}
                    onClick={onRefresh}
                />
            ) : null}
            <span className="emailInbox__selectionCount" role="status">
                {selected > 0 ? `${selected} selecionada(s)` : 'Selecione mensagens para organizar'}
            </span>
        </div>
    );
}

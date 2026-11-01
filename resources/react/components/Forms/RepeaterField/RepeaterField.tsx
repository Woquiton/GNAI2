import { useRef, type Key, type ReactNode } from 'react';
import Button from '@/components/UI/Button/Button';
import { joinClassNames } from '@/utils/joinClassNames';
import '@/components/Forms/RemovableField/RemovableField.css';
import './RepeaterField.css';

interface RepeaterFieldProps<T> {
    items: T[];
    onChange: (items: T[]) => void;
    /** Valores iniciais de um bloco novo. */
    createItem: () => T;
    /** Campos do bloco; `update` recebe só as chaves alteradas. */
    renderItem: (
        item: T,
        index: number,
        update: (patch: Partial<T>) => void,
        remove: () => void,
    ) => ReactNode;
    /** Nome do bloco para leitores de tela, por exemplo "Barreira 2". */
    itemLabel: (index: number) => string;
    /** Texto curto do botão de adicionar, por exemplo "Barreira". */
    addLabel: string;
    emptyMessage?: string;
    /** Em field, renderItem compõe a remoção junto ao controle com RemovableField. */
    removePlacement?: 'corner' | 'field';
    disabled?: boolean;
    /**
     * Identidade estável do bloco (por exemplo, o `id` de um registro salvo). Sem ela, o
     * componente mantém chaves internas que acompanham inclusões e remoções feitas por ele.
     */
    getItemKey?: (item: T, index: number) => Key;
}

/**
 * Chaves de interface que acompanham os blocos sem alterar o payload enviado ao backend.
 * Remover um bloco intermediário preserva o estado interno (plugins, foco) dos seguintes.
 */
function useRepeaterKeys(length: number) {
    const state = useRef({ keys: [] as string[], next: 0 });
    const current = state.current;

    while (current.keys.length < length) {
        current.keys.push(`repeater-item-${current.next++}`);
    }

    if (current.keys.length > length) {
        current.keys.length = length;
    }

    return {
        keys: current.keys,
        remove(index: number): void {
            current.keys.splice(index, 1);
        },
    };
}

/**
 * Lista de blocos repetíveis (barreiras, estratégias, objetivos...), substituta do
 * `x-forms.repeater` do Blade. O formulário pai controla os itens e envia o array; cada bloco tem
 * o botão de remover no canto e a lista termina com o botão "+ Item" no padrão Ubold.
 */
export default function RepeaterField<T>({
    items,
    onChange,
    createItem,
    renderItem,
    itemLabel,
    addLabel,
    emptyMessage,
    removePlacement = 'corner',
    disabled = false,
    getItemKey,
}: RepeaterFieldProps<T>): React.JSX.Element {
    const repeaterKeys = useRepeaterKeys(items.length);

    function update(index: number, patch: Partial<T>): void {
        onChange(items.map((item, current) => (current === index ? { ...item, ...patch } : item)));
    }

    function remove(index: number): void {
        repeaterKeys.remove(index);
        onChange(items.filter((_, current) => current !== index));
    }

    return (
        <div className="repeaterField">
            {items.length === 0 && emptyMessage ? (
                <p className="repeaterField__empty">{emptyMessage}</p>
            ) : null}

            {items.map((item, index) => {
                const label = itemLabel(index);

                return (
                    <fieldset
                        key={getItemKey ? getItemKey(item, index) : repeaterKeys.keys[index]}
                        className={joinClassNames(
                            'repeaterField__item',
                            removePlacement === 'field' && 'repeaterField__item--fieldRemoval',
                        )}
                    >
                        <legend className="repeaterField__legend">{label}</legend>
                        {removePlacement === 'corner' ? (
                            <Button
                                type="button"
                                tone="dark-red"
                                size="xs"
                                iconOnly
                                leftIconClass="fa fa-times"
                                className="repeaterField__remove"
                                aria-label={`Remover ${label.toLowerCase()}`}
                                disabled={disabled}
                                onClick={() => remove(index)}
                            />
                        ) : null}
                        {renderItem(
                            item,
                            index,
                            (patch) => update(index, patch),
                            () => remove(index),
                        )}
                    </fieldset>
                );
            })}

            <div>
                <Button
                    type="button"
                    tone="white"
                    className="removableField__add"
                    labelIconClass="fa fa-plus"
                    label={addLabel}
                    aria-label={`Adicionar ${addLabel.toLowerCase()}`}
                    disabled={disabled}
                    onClick={() => onChange([...items, createItem()])}
                />
            </div>
        </div>
    );
}

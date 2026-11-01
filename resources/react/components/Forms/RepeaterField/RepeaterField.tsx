import type { ReactNode } from "react";
import Button from "@/components/UI/Button/Button";
import "@/components/Forms/RemovableField/RemovableField.css";
import "./RepeaterField.css";

/**
 * Lista de blocos repetíveis (barreiras, estratégias, objetivos...), substituta
 * do `x-forms.repeater` do Blade. O formulário pai controla os itens e envia o
 * array; cada bloco tem o botão de remover no canto e a lista termina com o
 * botão "+ Item" no padrão Ubold usado em Publicações.
 */
export default function RepeaterField<T>({
    items,
    onChange,
    createItem,
    renderItem,
    itemLabel,
    addLabel,
    emptyMessage,
    removePlacement = "corner",
    disabled = false,
}: {
    items: T[];
    onChange: (items: T[]) => void;
    /** Valores iniciais de um bloco novo. */
    createItem: () => T;
    /** Campos do bloco; `update` recebe só as chaves alteradas. */
    renderItem: (item: T, index: number, update: (patch: Partial<T>) => void, remove: () => void) => ReactNode;
    /** Nome do bloco para leitores de tela, por exemplo "Barreira 2". */
    itemLabel: (index: number) => string;
    /** Texto curto do botão de adicionar, por exemplo "Barreira". */
    addLabel: string;
    emptyMessage?: string;
    /** Em field, renderItem compõe a remoção junto ao controle com RemovableField. */
    removePlacement?: "corner" | "field";
    disabled?: boolean;
}): React.JSX.Element {
    const update = (index: number, patch: Partial<T>): void => {
        onChange(items.map((item, current) => (current === index ? { ...item, ...patch } : item)));
    };

    return (
        <div className="repeaterField">
            {items.length === 0 && emptyMessage ? (
                <p className="repeaterField__empty">{emptyMessage}</p>
            ) : null}

            {items.map((item, index) => (
                <fieldset
                    key={index}
                    className={`repeaterField__item${removePlacement === "field" ? " repeaterField__item--fieldRemoval" : ""}`}
                >
                    <legend className="repeaterField__legend">{itemLabel(index)}</legend>
                    {removePlacement === "corner" ? (
                        <Button
                            type="button"
                            tone="dark-red"
                            size="xs"
                            iconOnly
                            leftIconClass="fa fa-times"
                            className="repeaterField__remove"
                            title={`Remover ${itemLabel(index).toLowerCase()}`}
                            aria-label={`Remover ${itemLabel(index).toLowerCase()}`}
                            disabled={disabled}
                            onClick={() => onChange(items.filter((_, current) => current !== index))}
                        />
                    ) : null}
                    {renderItem(
                        item,
                        index,
                        (patch) => update(index, patch),
                        () => onChange(items.filter((_, current) => current !== index)),
                    )}
                </fieldset>
            ))}

            <div>
                <Button
                    type="button"
                    tone="white"
                    className="removableField__add"
                    labelIconClass="fa fa-plus"
                    label={addLabel}
                    title={`Adicionar ${addLabel.toLowerCase()}`}
                    aria-label={`Adicionar ${addLabel.toLowerCase()}`}
                    disabled={disabled}
                    onClick={() => onChange([...items, createItem()])}
                />
            </div>
        </div>
    );
}

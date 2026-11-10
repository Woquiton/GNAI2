import TextInputField from '@/components/Forms/FormFields/TextInputField';
import Button from '@/components/UI/Button/Button';

/** Descrições editáveis sem exigir que o autor conheça HTML ou use o mouse no editor. */
export default function BuilderRichTextFields({
    id,
    html,
    required,
    disabled,
    onChange,
}: {
    id: string;
    html: string;
    required: boolean;
    disabled: boolean;
    onChange: (html: string) => void;
}): React.JSX.Element | null {
    const document = new DOMParser().parseFromString(html, 'text/html');
    const images = Array.from(document.images);
    const tables = Array.from(document.querySelectorAll('table'));
    if (!images.length && !tables.length) return null;

    function update(change: () => void): void {
        change();
        onChange(document.body.innerHTML);
    }

    return (
        <div className="builderRichTextFields">
            <p>Identifique as imagens e tabelas inseridas no texto:</p>
            {images.map((image, index) => (
                <TextInputField
                    key={index}
                    id={`${id}-image-${index}-alt`}
                    label={`Descrição da imagem ${index + 1} no texto`}
                    hint="Descreva a informação que a imagem transmite. Inclua os textos importantes de cartazes."
                    value={image.alt}
                    required={required}
                    disabled={disabled}
                    maxLength={255}
                    onChange={(alt) => update(() => image.setAttribute('alt', alt))}
                />
            ))}
            {tables.map((table, index) => (
                <div key={index}>
                    <TextInputField
                        id={`${id}-table-${index}-caption`}
                        label={`Título da tabela ${index + 1}`}
                        value={table.caption?.textContent ?? ''}
                        required={required}
                        disabled={disabled}
                        maxLength={255}
                        onChange={(caption) =>
                            update(() => {
                                const title = table.caption ?? table.createCaption();
                                title.textContent = caption;
                            })
                        }
                    />
                    <Button
                        size="sm"
                        tone="white"
                        label="Usar primeira linha como cabeçalho"
                        leftIconClass="fa fa-table"
                        title={`Identificar as colunas da tabela ${index + 1} pela primeira linha`}
                        disabled={disabled || !table.rows.length}
                        onClick={() =>
                            update(() => {
                                Array.from(table.rows[0].cells).forEach((cell) => {
                                    const header = document.createElement('th');
                                    header.innerHTML = cell.innerHTML;
                                    header.colSpan = cell.colSpan;
                                    header.rowSpan = cell.rowSpan;
                                    header.scope = 'col';
                                    cell.replaceWith(header);
                                });
                            })
                        }
                    />
                    <p>Use essa opção quando a primeira linha identificar as colunas da tabela.</p>
                </div>
            ))}
        </div>
    );
}

import { useId } from 'react';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Button from '@/components/UI/Button/Button';
import './SearchInput.css';

interface SearchInputProps {
    placeholder?: string;
    /** Rótulo visível acima do campo; sem ele, o placeholder serve de nome acessível. */
    label?: string;
    id?: string;
    name?: string;
    /** Valor controlado; sem ele o campo é livre e o termo chega só no envio. */
    value?: string;
    onChange?: (query: string) => void;
    onSearch?: (query: string) => void;
    /** Pesquisa em andamento: marca o formulário como ocupado sem bloquear a digitação. */
    busy?: boolean;
}

/** Campo de busca grande com botão, no padrão da tela de resultados de busca do Ubold. */
export default function SearchInput({
    placeholder = 'Buscar...',
    label,
    id,
    name = 'query',
    value,
    onChange,
    onSearch,
    busy = false,
}: SearchInputProps): React.JSX.Element {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <form
            role="search"
            className="searchInput"
            aria-busy={busy || undefined}
            onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                onSearch?.(String(data.get(name) ?? ''));
            }}
        >
            {label ? (
                <label className="searchInput__label" htmlFor={inputId}>
                    {label}
                </label>
            ) : null}
            <div className="searchInput__control">
                <TextInput
                    id={inputId}
                    type="search"
                    name={name}
                    placeholder={placeholder}
                    aria-label={label ? undefined : placeholder}
                    autoComplete="off"
                    value={value}
                    onChange={onChange ? (event) => onChange(event.target.value) : undefined}
                />
                <Button
                    type="submit"
                    tone="default"
                    size="lg"
                    leftIconClass={busy ? 'fa fa-spinner fa-spin' : 'fa fa-search'}
                    label="Buscar"
                />
            </div>
        </form>
    );
}

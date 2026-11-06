import SearchInput from '@/components/UI/SearchInput/SearchInput';
import { HELP_TOUR_TARGETS } from '../helpTours';
import '@styles/components/Help/List/HelpResults.css';

interface HelpSearchProps {
    value: string;
    loading: boolean;
    onChange: (value: string) => void;
    onSubmit: () => void;
}

/** Campo de busca da Central de Ajuda, centralizado acima dos resultados. */
export default function HelpSearch({
    value,
    loading,
    onChange,
    onSubmit,
}: HelpSearchProps): React.JSX.Element {
    return (
        <div className="helpSearch" data-tour={HELP_TOUR_TARGETS.search}>
            <SearchInput
                id="help-search"
                name="busca"
                label="O que você precisa fazer?"
                placeholder="Ex.: como criar um PEI, clonar um item, registrar devolução"
                value={value}
                busy={loading}
                onChange={onChange}
                onSearch={onSubmit}
            />
        </div>
    );
}

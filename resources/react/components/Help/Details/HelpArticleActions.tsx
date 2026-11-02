import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { helpUrls } from '../Help.routes';

/** Rodapé fixo da visualização do artigo: voltar para a busca da Central de Ajuda. */
export default function HelpArticleActions(): React.JSX.Element {
    return (
        <FormActions>
            <Button
                href={helpUrls.index}
                tone="cancel"
                leftIconClass="fa fa-arrow-left"
                label="Voltar"
                aria-label="Voltar para a Central de Ajuda"
            />
        </FormActions>
    );
}

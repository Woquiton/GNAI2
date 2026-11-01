import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { profileUrls } from '../Profile.routes';

interface ProfileFormActionsProps {
    processing: boolean;
    photoValidating: boolean;
    uploadPercentage?: number;
}

function submissionStatus({
    processing,
    photoValidating,
    uploadPercentage,
}: ProfileFormActionsProps): string | undefined {
    if (photoValidating) {
        return 'Preparando a foto selecionada...';
    }

    if (!processing) {
        return undefined;
    }

    return uploadPercentage !== undefined
        ? `Enviando foto: ${uploadPercentage}%`
        : 'Salvando alterações...';
}

/** Rodapé fixo dos formulários de perfil: cancelar volta ao painel; salvar envia o perfil. */
export default function ProfileFormActions(props: ProfileFormActionsProps): React.JSX.Element {
    const { processing, photoValidating } = props;

    return (
        <FormActions status={submissionStatus(props)}>
            <Button
                href={profileUrls.dashboard}
                tone="cancel"
                label="Cancelar"
                title="Cancelar e voltar ao início"
                aria-label="Cancelar e voltar ao início"
                disabled={processing}
            />
            <Button
                type="submit"
                tone="save"
                label="Salvar"
                title="Salvar alterações"
                aria-label={processing ? 'Salvando alterações' : 'Salvar alterações'}
                disabled={processing || photoValidating}
            />
        </FormActions>
    );
}

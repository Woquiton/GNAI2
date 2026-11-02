import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { publicationUrls } from '../Publications.routes';
import type { PublicationRecord, PublicationDetailsPermissions } from '../Publications.types';
export default function PublicationDetailsActions({
    publication,
    backRoute,
    can,
    processing,
    onDelete,
}: {
    publication: PublicationRecord;
    backRoute: string;
    can: PublicationDetailsPermissions;
    processing: boolean;
    onDelete: () => void;
}): React.JSX.Element {
    return (
        <FormActions
            secondary={
                can.pdf || publication.public_url ? (
                    <>
                        {can.pdf ? (
                            <Button
                                href={publicationUrls.pdf(publication.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                tone="dark-red"
                                leftIconClass="fa fa-file-pdf-o"
                                label="PDF"
                                title="Exportar publicação em PDF"
                                aria-label="Exportar publicação em PDF"
                            />
                        ) : null}
                        {publication.public_url ? (
                            <Button
                                href={publication.public_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                tone="dark-blue"
                                leftIconClass="fa fa-external-link"
                                label="Ver no site"
                                title="Abrir a publicação no site em nova aba"
                                aria-label="Abrir a publicação no site em nova aba"
                            />
                        ) : null}
                    </>
                ) : undefined
            }
        >
            <Button
                href={backRoute || publicationUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para as publicações"
                aria-label="Voltar para as publicações"
                disabled={processing}
            />
            {can.edit ? (
                <Button
                    href={publicationUrls.edit(publication.id)}
                    tone="warning"
                    leftIconClass="fa fa-pencil"
                    label="Editar"
                    title="Editar publicação"
                    aria-label="Editar publicação"
                    disabled={processing}
                />
            ) : null}
            {can.destroy ? (
                <Button
                    tone="dark-red"
                    leftIconClass="fa fa-trash-o"
                    label="Excluir"
                    title="Excluir publicação"
                    aria-label="Excluir publicação"
                    disabled={processing}
                    onClick={onDelete}
                />
            ) : null}
        </FormActions>
    );
}

import { useObjectUrl } from '@/components/Forms/ImageUploadField/ImageUploadField';
import type { PdfHeaderFormData } from './usePdfHeaderSettingsForm';
import './PdfHeaderPreview.css';

/** Prévia dos dados da instituição; a paginação final depende do documento emitido. */
export default function PdfHeaderPreview({
    data,
    currentLogoUrl,
}: {
    data: PdfHeaderFormData;
    currentLogoUrl: string | null;
}): React.JSX.Element {
    const fileUrl = useObjectUrl(data.logo);
    const logoUrl = data.remove_logo ? null : (fileUrl ?? currentLogoUrl);

    return (
        <div className="pdfHeaderPreview" aria-label="Prévia do cabeçalho dos PDFs">
            {logoUrl ? <img src={logoUrl} alt="Logotipo da instituição" /> : null}
            <div className="pdfHeaderPreview__text">
                <strong>{data.institution_name || 'Nome da instituição'}</strong>
                {data.issuing_unit ? <p>{data.issuing_unit}</p> : null}
                {data.details ? <p>{data.details}</p> : null}
            </div>
        </div>
    );
}

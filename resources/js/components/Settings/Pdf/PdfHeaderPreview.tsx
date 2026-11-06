import { useObjectUrl } from '@/components/Forms/ImageUploadField/ImageUploadField';
import type { PdfHeaderFormData } from './usePdfHeaderSettingsForm';
import '@styles/components/Settings/Pdf/PdfHeaderPreview.css';

/** Prévia do cabeçalho como sai nos PDFs; o título varia conforme o documento emitido. */
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
            {logoUrl ? (
                <img
                    className={`pdfHeaderPreview__logo pdfHeaderPreview__logo--${data.logo_shape}`}
                    src={logoUrl}
                    alt="Logotipo da instituição"
                />
            ) : null}
            <div className="pdfHeaderPreview__text">
                <strong>{data.institution_name || 'Nome da instituição'}</strong>
                {data.issuing_unit ? (
                    <p className="pdfHeaderPreview__unit">{data.issuing_unit}</p>
                ) : null}
                {data.details ? <p className="pdfHeaderPreview__details">{data.details}</p> : null}
            </div>
            <div className="pdfHeaderPreview__title">Título do documento</div>
        </div>
    );
}

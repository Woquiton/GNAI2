import DetailField from '@/components/UI/DetailField/DetailField';
import { waitlistUrls } from './Waitlists.routes';
import type { WaitlistRecord } from './Waitlists.types';
import '@styles/components/Waitlists/WaitlistResourceDetails.css';

type WaitlistResourceDetailsProps = Pick<
    WaitlistRecord,
    'waitlistable_id' | 'item_name' | 'asset_code'
>;

/**
 * Recurso solicitado e patrimônio, compartilhados pela visualização e pela edição. Deve ficar
 * dentro de um `DetailGrid`; o nome do item abre o cadastro em outra aba.
 */
export default function WaitlistResourceDetails({
    waitlistable_id,
    item_name,
    asset_code,
}: WaitlistResourceDetailsProps): React.JSX.Element {
    return (
        <>
            <DetailField label="Recurso Solicitado" className="waitlistResourceDetails__item">
                <a href={waitlistUrls.item(waitlistable_id)} target="_blank" rel="noreferrer">
                    {item_name}
                </a>
            </DetailField>
            <DetailField label="Patrimônio / Tombamento">
                {asset_code || 'Não se aplica'}
            </DetailField>
        </>
    );
}

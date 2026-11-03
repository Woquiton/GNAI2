import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { TAG_TOUR_TARGETS } from '../tagTours';
import type { TagRecord } from '../Tags.types';

/** Nome, status e publicações vinculadas de uma etiqueta. */
export default function TagDetails({ tag }: { tag: TagRecord }): React.JSX.Element {
    return (
        <CardBox tourTarget={TAG_TOUR_TARGETS.details}>
            <FormSection
                id="tag-show-identification"
                title="Identificação"
                variant="inline"
                iconClass="fa fa-tags"
            >
                <DetailGrid>
                    <DetailField label="Nome da Etiqueta" wide>
                        {tag.name}
                    </DetailField>
                    <DetailField label="Etiqueta Ativa">
                        <TableLabel tone={tag.is_active ? 'success' : 'inverse'}>
                            {tag.is_active ? 'Ativo' : 'Inativo'}
                        </TableLabel>
                    </DetailField>
                    {tag.publications_count !== undefined ? (
                        <DetailField label="Publicações Vinculadas">
                            {tag.publications_count}
                        </DetailField>
                    ) : null}
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}

import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { TAG_TOUR_TARGETS } from '../tagTours';
import type { TagRecord } from '../Tags.types';

/** Identificação e aplicações da etiqueta no módulo escolhido. */
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
                    <DetailField label="Módulo">{tag.module_label}</DetailField>
                    <DetailField label="Cor">
                        <span>
                            <i
                                className="fa fa-circle"
                                style={{ color: tag.color }}
                                aria-hidden="true"
                            />{' '}
                            {tag.color}
                        </span>
                    </DetailField>
                    <DetailField label="Etiqueta Ativa">
                        <TableLabel tone={tag.is_active ? 'success' : 'inverse'}>
                            {tag.is_active ? 'Ativo' : 'Inativo'}
                        </TableLabel>
                    </DetailField>
                    {tag.module === 'publications' && tag.publications_count !== undefined ? (
                        <DetailField label="Publicações Vinculadas">
                            {tag.publications_count}
                        </DetailField>
                    ) : null}
                    {tag.module === 'inbox' && tag.mailbox_states_count !== undefined ? (
                        <DetailField label="Aplicações na Inbox">
                            {tag.mailbox_states_count}
                        </DetailField>
                    ) : null}
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}

import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import TagList from '@/components/UI/TagList/TagList';
import type { PositionDetailsRecord } from '../Positions.types';

/** Informações, atribuições e permissões vinculadas de um cargo. */
export default function PositionDetails({
    position,
}: {
    position: PositionDetailsRecord;
}): React.JSX.Element {
    return (
        <CardBox>
            <FormSection
                id="position-show-information"
                title="Informações do Cargo"
                variant="inline"
                iconClass="fa fa-briefcase"
            >
                <DetailGrid>
                    <DetailField label="Nome do Cargo / Função">
                        <strong>{position.name}</strong>
                    </DetailField>
                    <DetailField label="Status de Disponibilidade">
                        <TableLabel tone={position.is_active ? 'success' : 'inverse'}>
                            <i
                                className={position.is_active ? 'fa fa-check-circle' : 'fa fa-ban'}
                                aria-hidden="true"
                            />{' '}
                            {position.is_active ? 'Ativo' : 'Desativado'}
                        </TableLabel>
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="position-show-description"
                title="Atribuições e Descrição"
                variant="inline"
                iconClass="fa fa-file-text-o"
            >
                <DetailGrid>
                    <DetailField label="Descrição da Função" wide preserveLineBreaks>
                        {position.description ||
                            'Nenhuma descrição detalhada foi fornecida para este cargo.'}
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="position-show-permissions"
                title="Permissões Vinculadas ao Cargo"
                variant="inline"
                iconClass="fa fa-key"
            >
                <DetailGrid>
                    <DetailField label="Permissões Vinculadas" wide>
                        <TagList items={position.permissions ?? []} emptyMessage="---" />
                    </DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}

import FormSection from '@/components/Forms/FormSection/FormSection';
import InspectionHistoryTable from '@/components/Inclusion/Inspections/InspectionHistoryTable/InspectionHistoryTable';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import ExpandableContent from '@/components/UI/ExpandableContent/ExpandableContent';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import TagList from '@/components/UI/TagList/TagList';
import { resourceStatusTone } from '../Items.constants';
import { itemUrls } from '../Items.routes';
import type { ItemShowProps } from '../Items.types';
import ItemLoanHistory from './ItemLoanHistory';

const NOT_APPLICABLE = 'Não se aplica';

type ItemDetailsProps = Omit<ItemShowProps, 'can'> & {
    showInspections: boolean;
    loanPermissions: { list: boolean; view: boolean; viewStudent: boolean };
};

/** Identificação, gestão, histórico de empréstimos e de vistorias de um item. */
export default function ItemDetails({
    item,
    deficiencies,
    features,
    display,
    loans,
    showInspections,
    loanPermissions,
}: ItemDetailsProps): React.JSX.Element {
    return (
        <CardBox>
            <FormSection
                id="item-identification"
                title="Identificação"
                variant="inline"
                iconClass="fa fa-cube"
            >
                <DetailGrid>
                    <DetailField label="Tipo do Item">{display.itemTypeLabel}</DetailField>
                    <DetailField label="Descrição do Item">{item.name}</DetailField>
                    <DetailField label="Natureza do Recurso">
                        {item.is_digital ? 'Recurso Digital' : 'Recurso Físico'}
                    </DetailField>
                    <DetailField label="Patrimônio / Tombamento">
                        {item.asset_code || NOT_APPLICABLE}
                    </DetailField>
                    <DetailField label="Descrição Detalhada" wide>
                        <ExpandableContent>
                            <RichTextContent html={display.notesHtml} />
                        </ExpandableContent>
                    </DetailField>
                    <DetailField label="Recursos de Acessibilidade" wide>
                        <TagList items={features} emptyMessage="Nenhum recurso definido." />
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="item-management"
                title="Gestão"
                variant="inline"
                iconClass="fa fa-tasks"
            >
                <DetailGrid>
                    <DetailField label="Quantidade Total">
                        {item.is_digital ? NOT_APPLICABLE : (item.quantity ?? '---')}
                    </DetailField>
                    <DetailField label="Quantidade Disponível">
                        {item.is_digital ? NOT_APPLICABLE : (item.quantity_available ?? '---')}
                    </DetailField>
                    <DetailField label="Status do Recurso">
                        <TableLabel tone={resourceStatusTone(item.status)}>
                            {display.statusLabel}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Permite Empréstimos">
                        {item.is_loanable ? 'Sim' : 'Não'}
                    </DetailField>
                    <DetailField label="Status no Sistema">
                        <TableLabel tone={item.is_active ? 'success' : 'inverse'}>
                            {item.is_active ? 'Ativo' : 'Inativo'}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Público Alvo" wide>
                        <TagList
                            items={deficiencies}
                            emptyMessage="Nenhum público-alvo definido."
                        />
                    </DetailField>
                </DetailGrid>
            </FormSection>
            {loanPermissions.list && (item.is_loanable || loans.length > 0) ? (
                <ItemLoanHistory
                    loans={loans}
                    canViewLoan={loanPermissions.view}
                    canViewStudent={loanPermissions.viewStudent}
                />
            ) : null}
            {showInspections ? (
                <InspectionHistoryTable
                    id="item-inspections"
                    baseUrl={itemUrls.show(item.id)}
                    inspections={display.inspectionDetails}
                />
            ) : null}
        </CardBox>
    );
}

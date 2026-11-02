import ItemDetails from '@/components/Inclusion/Items/Details/ItemDetails';
import ItemDetailsActions from '@/components/Inclusion/Items/Details/ItemDetailsActions';
import ItemDeleteModal from '@/components/Inclusion/Items/ItemDeleteModal';
import { itemBreadcrumb, itemUrls } from '@/components/Inclusion/Items/Items.routes';
import type { ItemShowProps } from '@/components/Inclusion/Items/Items.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionItemsShowPage({
    can,
    ...details
}: ItemShowProps): React.JSX.Element {
    const { item } = details;
    const removal = useConfirmedAction<typeof item>({
        failureText: 'Não foi possível concluir a exclusão. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Detalhes do Item"
            subtitle="Visualize as informações cadastrais, a disponibilidade e o histórico de vistorias do item."
            documentTitle={item.name}
            breadcrumbItems={itemBreadcrumb({ item })}
            busy={removal.processing}
        >
            <ItemDetails
                {...details}
                showInspections={can.inspection}
                loanPermissions={{
                    list: can.loans,
                    view: can.viewLoan,
                    viewStudent: can.viewStudent,
                }}
            />
            <ItemDetailsActions
                itemId={item.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(item)}
            />
            <ItemDeleteModal
                item={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', itemUrls.destroy(item.id))}
            />
        </BusinessPage>
    );
}

import type { ItemListPermissions, ItemPaginator, ItemSummary } from '../Items.types';

export interface ItemListProps {
    items: ItemPaginator;
    permissions: ItemListPermissions;
    processing: boolean;
    onDelete: (item: ItemSummary) => void;
}

export interface ItemResultsProps extends ItemListProps {
    loading: boolean;
    itemTypeFilter: string;
    onPageSizeSelect: (size: number) => void;
    onPageSelect: (page: number) => void;
}

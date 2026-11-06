import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { TableListRowActions } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { itemTypeLabels } from '../Items.constants';
import { itemUrls } from '../Items.routes';
import type { ItemListPermissions, ItemSummary } from '../Items.types';
import ItemStatusLabel from './ItemStatusLabel';
import { ITEM_TOUR_TARGETS } from '../itemTours';

interface ItemCatalogCardProps {
    item: ItemSummary;
    permissions: ItemListPermissions;
    processing: boolean;
    onDelete: (item: ItemSummary) => void;
}

export default function ItemCatalogCard({
    item,
    permissions,
    processing,
    onDelete,
}: ItemCatalogCardProps): React.JSX.Element {
    const [failedSource, setFailedSource] = useState<string | null>(null);
    const image = item.catalog_image_url;
    const visual =
        image && failedSource !== image ? (
            <img
                src={image}
                alt={item.name}
                loading="lazy"
                onError={() => setFailedSource(image)}
            />
        ) : (
            <span className="itemCatalogCard__placeholder">
                <i
                    className={
                        item.item_type === 'assistive_technology' ? 'fa fa-cube' : 'fa fa-book'
                    }
                    aria-hidden="true"
                />
                <span>Sem imagem de capa</span>
            </span>
        );
    const stock = item.is_digital
        ? 'Estoque ilimitado'
        : `${item.quantity_available ?? 0} de ${item.quantity ?? 0} disponíveis`;

    return (
        <article className="itemCatalogCard">
            {permissions.show ? (
                <Link
                    href={itemUrls.show(item.id)}
                    className="itemCatalogCard__media"
                    aria-label={`Visualizar ${item.name}`}
                >
                    {visual}
                </Link>
            ) : (
                <div className="itemCatalogCard__media">{visual}</div>
            )}
            {permissions.show || permissions.destroy ? (
                <div
                    className="itemCatalogCard__actions"
                    data-tour={ITEM_TOUR_TARGETS.catalogActions}
                >
                    <TableListRowActions
                        view={
                            permissions.show && {
                                href: itemUrls.show(item.id),
                                label: `Visualizar ${item.name}`,
                            }
                        }
                        remove={
                            permissions.destroy && {
                                label: `Excluir ${item.name}`,
                                disabled: processing,
                                onClick: () => onDelete(item),
                            }
                        }
                        menuLabel={`Ações de ${item.name}`}
                    />
                </div>
            ) : null}
            <div className="itemCatalogCard__details">
                <h2 title={item.name}>
                    {permissions.show ? (
                        <Link href={itemUrls.show(item.id)}>{item.name}</Link>
                    ) : (
                        item.name
                    )}
                </h2>
                <p title={itemTypeLabels[item.item_type]}>{itemTypeLabels[item.item_type]}</p>
                <div className="itemCatalogCard__labels">
                    <ItemStatusLabel item={item} />
                    <TableLabel tone="inverse">{item.is_digital ? 'Digital' : 'Físico'}</TableLabel>
                </div>
                <p className="itemCatalogCard__stock" title={stock}>
                    {stock}
                </p>
                {item.asset_code ? (
                    <p title={`Patrimônio: ${item.asset_code}`}>Patrimônio: {item.asset_code}</p>
                ) : null}
            </div>
        </article>
    );
}

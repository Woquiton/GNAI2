import PageHeader from '@/components/Navigation/PageHeader/PageHeader';
import EcommerceDashboard from '@/catalog/pages/EcommerceDashboard/EcommerceDashboard';
import ProductCatalog from '@/catalog/components/UI/ProductCatalog/ProductCatalog';
import ProductEditor from '@/catalog/components/Forms/ProductEditor/ProductEditor';
import EcommerceOrders from '@/catalog/pages/EcommerceOrders/EcommerceOrders';
import EcommerceSellers from '@/catalog/pages/EcommerceSellers/EcommerceSellers';
import type { EcommercePageDefinition } from './Ecommerce.types';
import './Ecommerce.css';
export default function Ecommerce({ page }: { page: EcommercePageDefinition }): React.JSX.Element {
    return (
        <section className="ecommercePage" aria-label={`eCommerce, ${page.title}`}>
            <PageHeader
                title={page.title}
                subtitle={
                    page.kind === 'dashboard'
                        ? 'Bem-vindo ao painel administrativo Interface!'
                        : undefined
                }
                breadcrumbItems={
                    page.breadcrumb.length
                        ? [
                              ...page.breadcrumb.map((label) => ({ label, href: '#' })),
                              {
                                  label:
                                      page.kind === 'product-detail'
                                          ? 'Adicionar/editar'
                                          : page.title,
                              },
                          ]
                        : undefined
                }
            />
            {page.kind === 'dashboard' ? (
                <EcommerceDashboard />
            ) : page.kind === 'products' ? (
                <ProductCatalog />
            ) : page.kind === 'product-detail' ? (
                <ProductEditor />
            ) : page.kind === 'orders' ? (
                <EcommerceOrders />
            ) : (
                <EcommerceSellers />
            )}
        </section>
    );
}

import CardBox from '@/components/UI/CardBox/CardBox';
import CrmToolbar from '@/catalog/components/UI/CrmToolbar/CrmToolbar';
import PeopleTable from '@/catalog/components/Tables/PeopleTable/PeopleTable';
import ContactActivityCard from '@/catalog/components/UI/ContactActivityCard/ContactActivityCard';
import { crmPeople } from '@/catalog/pages/Crm/Crm.data';
import './CrmContacts.css';
export default function CrmContacts({
    customers = false,
}: {
    customers?: boolean;
}): React.JSX.Element {
    return (
        <div className={`crmContacts${customers ? ' crmContacts--customers' : ''}`}>
            <div className="crmContacts__main">
                <CardBox>
                    <CrmToolbar
                        kind="person"
                        addLabel={customers ? 'Adicionar cliente' : 'Adicionar contato'}
                        searchLabel={customers ? 'Pesquisar clientes' : 'Pesquisar contatos'}
                    />
                    <PeopleTable records={crmPeople} />
                </CardBox>
            </div>
            {!customers && (
                <aside className="crmContacts__aside">
                    <ContactActivityCard />
                </aside>
            )}
        </div>
    );
}

import { TableListRowActions, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TagName from '@/components/Tags/TagName';
import type { PeopleIndexProps, PersonListRow } from '../People.types';
import { personUrls } from '../People.routes';

export function personColumns(can: PeopleIndexProps['can']): TableListColumn<PersonListRow>[] {
    return [
        { id: 'name', label: 'Nome', fixed: 'start', render: (person) => person.name },
        { id: 'email', label: 'E-mail', render: (person) => person.email ?? 'Não informado' },
        { id: 'phone', label: 'Telefone', render: (person) => person.phone ?? 'Não informado' },
        {
            id: 'tags',
            label: 'Etiquetas',
            render: (person) =>
                person.roles.length || person.tags.length ? (
                    <div className="peopleList__tags">
                        {person.roles.map((role) => (
                            <TagName key={`role:${role}`} name={role} special />
                        ))}
                        {person.tags.map((tag) => (
                            <TagName key={`tag:${tag}`} name={tag} />
                        ))}
                    </div>
                ) : (
                    'Sem etiquetas'
                ),
        },
        {
            id: 'actions',
            label: 'Ações',
            fixed: 'end',
            render: (person) => (
                <TableListRowActions
                    edit={
                        can.edit && {
                            href: personUrls.edit(person.id),
                            label: `Editar ${person.name}`,
                        }
                    }
                />
            ),
        },
    ];
}

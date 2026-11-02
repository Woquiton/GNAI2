import { formatTableListText, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { scheduleStatusLabels } from '../Publications.constants';
import type { PublicationRecord } from '../Publications.types';
function periodLabel(publication: PublicationRecord): string {
    if (!publication.has_schedule || !publication.start_date) return 'Sem datas';

    const dates =
        publication.start_date === publication.end_date
            ? publication.start_date_label
            : `${publication.start_date_label} a ${publication.end_date_label}`;

    return publication.start_time
        ? `${dates}, ${publication.start_time} a ${publication.end_time ?? ''}`
        : dates;
}

export const publicationColumns: TableListColumn<PublicationRecord>[] = [
    {
        id: 'title',
        label: 'Título',
        width: '32%',
        fixed: 'start',
        render: (publication) => (
            <>
                {publication.title}
                {publication.is_featured ? (
                    <span className="publicationIndex__featured">
                        <i className="fa fa-star" aria-hidden="true" /> Destaque
                    </span>
                ) : null}
            </>
        ),
    },
    {
        id: 'type',
        label: 'Tipo',
        width: '12%',
        render: (publication) => publication.type_label,
    },
    {
        id: 'published',
        label: 'Publicação',
        width: '13%',
        render: (publication) => publication.published_at_label,
    },
    {
        id: 'period',
        label: 'Período',
        width: '19%',
        render: (publication) => (
            <>
                {periodLabel(publication)}
                {publication.schedule_status ? (
                    <span className="publicationIndex__schedule">
                        {scheduleStatusLabels[publication.schedule_status]}
                    </span>
                ) : null}
            </>
        ),
    },
    {
        id: 'status',
        label: 'Situação',
        width: '12%',
        render: (publication) => (
            <TableLabel tone={publication.is_active ? 'success' : 'inverse'}>
                {publication.is_active ? 'Publicado' : 'Rascunho'}
            </TableLabel>
        ),
    },
    {
        id: 'tags',
        label: 'Etiquetas',
        width: '14%',
        defaultVisible: false,
        render: (publication) => publication.tags.map((tag) => tag.name).join(', ') || 'Nenhuma',
    },
    {
        id: 'location',
        label: 'Local',
        width: '16%',
        defaultVisible: false,
        render: (publication) => publication.location || 'Não informado',
    },
    {
        id: 'author',
        label: 'Autor',
        width: '16%',
        defaultVisible: false,
        render: (publication) => publication.author_name || 'Não informado',
    },
    {
        id: 'organizer',
        label: 'Organizador',
        width: '16%',
        defaultVisible: false,
        render: (publication) => publication.organizer || 'Não informado',
    },
    {
        id: 'audience',
        label: 'Público',
        width: '16%',
        defaultVisible: false,
        render: (publication) => publication.audience || 'Não informado',
    },
    {
        id: 'summary',
        label: 'Resumo',
        width: '16%',
        defaultVisible: false,
        render: (publication) => formatTableListText(publication.summary),
    },
];

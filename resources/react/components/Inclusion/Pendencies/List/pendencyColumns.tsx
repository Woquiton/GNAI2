import {
    formatTableListDate,
    formatTableListText,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import { priorityTone } from '../Pendencies.constants';
import type {
    PendencyListRecord,
    PendencyListVariant,
    PendencyPriorityOption,
} from '../Pendencies.types';

const NOT_INFORMED = 'Não informado';

type PriorityMap = ReadonlyMap<string, PendencyPriorityOption>;

function PriorityLabel({
    pendency,
    priorities,
}: {
    pendency: PendencyListRecord;
    priorities: PriorityMap;
}): React.JSX.Element | string {
    const priority = pendency.priority ? priorities.get(pendency.priority) : undefined;

    if (!priority) {
        return NOT_INFORMED;
    }

    return <TableLabel tone={priorityTone(priority.color)}>{priority.label}</TableLabel>;
}

/** "Concluída" da listagem geral (Sim/Não). */
function CompletedLabel({ completed }: { completed: boolean }): React.JSX.Element {
    return (
        <TableLabel tone={completed ? 'success' : 'danger'}>
            <i
                className={completed ? 'fa fa-check-circle' : 'fa fa-times-circle'}
                aria-hidden="true"
            />{' '}
            {completed ? 'Sim' : 'Não'}
        </TableLabel>
    );
}

/** "Status" de "Minhas Pendências" (Concluída/Pendente). */
function StatusLabel({ completed }: { completed: boolean }): React.JSX.Element {
    return (
        <TableLabel tone={completed ? 'success' : 'danger'}>
            <i className={completed ? 'fa fa-check-circle' : 'fa fa-clock-o'} aria-hidden="true" />{' '}
            {completed ? 'Concluída' : 'Pendente'}
        </TableLabel>
    );
}

function complementaryColumns(): TableListColumn<PendencyListRecord>[] {
    return [
        {
            id: 'creator',
            label: 'Criado por',
            width: '16%',
            defaultVisible: false,
            render: (pendency) => pendency.creator?.name || NOT_INFORMED,
        },
        {
            id: 'description',
            label: 'Descrição',
            width: '16%',
            defaultVisible: false,
            render: (pendency) => formatTableListText(pendency.description),
        },
        {
            id: 'created',
            label: 'Criado em',
            width: '16%',
            defaultVisible: false,
            render: (pendency) => formatTableListDate(pendency.created_at, true),
        },
        {
            id: 'updated',
            label: 'Atualizado em',
            width: '16%',
            defaultVisible: false,
            render: (pendency) => formatTableListDate(pendency.updated_at, true),
        },
    ];
}

function dueDate(pendency: PendencyListRecord): string {
    return pendency.due_date ? dateLabel(pendency.due_date) : NOT_INFORMED;
}

/**
 * Colunas de dados das listagens; a geral mostra o profissional e "Concluída", e "Minhas
 * Pendências" mostra o status. As complementares começam ocultas no seletor de colunas.
 */
export function pendencyColumns(
    variant: PendencyListVariant,
    priorities: PriorityMap,
): TableListColumn<PendencyListRecord>[] {
    const priority: TableListColumn<PendencyListRecord> = {
        id: 'priority',
        label: 'Prioridade',
        width: variant === 'my' ? '16%' : '13%',
        render: (pendency) => <PriorityLabel pendency={pendency} priorities={priorities} />,
    };

    if (variant === 'my') {
        return [
            {
                id: 'title',
                label: 'Título',
                width: '40%',
                fixed: 'start',
                render: (pendency) => pendency.title,
            },
            priority,
            { id: 'due_date', label: 'Vencimento', width: '15%', render: dueDate },
            {
                id: 'status',
                label: 'Status',
                width: '17%',
                render: (pendency) => <StatusLabel completed={pendency.is_completed} />,
            },
            ...complementaryColumns(),
        ];
    }

    return [
        {
            id: 'title',
            label: 'Título',
            width: '30%',
            fixed: 'start',
            render: (pendency) => pendency.title,
        },
        {
            id: 'professional',
            label: 'Profissional',
            width: '22%',
            render: (pendency) => pendency.assigned_professional?.person?.name || NOT_INFORMED,
        },
        priority,
        { id: 'due_date', label: 'Vencimento', width: '12%', render: dueDate },
        {
            id: 'completed',
            label: 'Concluída',
            width: '11%',
            render: (pendency) => <CompletedLabel completed={pendency.is_completed} />,
        },
        ...complementaryColumns(),
    ];
}

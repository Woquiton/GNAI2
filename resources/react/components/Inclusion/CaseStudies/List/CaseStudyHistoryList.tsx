import { useMemo } from 'react';
import {
    TableListCard,
    TableListRowActions,
    TableListScroll,
    TableListSummary,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { caseStudyUrls } from '../CaseStudies.routes';
import type { CaseStudyListPermissions, CaseStudyRow } from '../CaseStudies.types';
import { caseStudyHistoryColumns } from './caseStudyColumns';

interface CaseStudyHistoryListProps {
    caseStudies: CaseStudyRow[];
    permissions: CaseStudyListPermissions;
}

/** Histórico completo de versões do aluno, sem filtros nem paginação. */
export default function CaseStudyHistoryList({
    caseStudies,
    permissions,
}: CaseStudyHistoryListProps): React.JSX.Element {
    const count = caseStudies.length;
    const summary = `${count} ${count === 1 ? 'registro' : 'registros'}`;
    const columns = useMemo<TableListColumn<CaseStudyRow>[]>(
        () => [
            ...caseStudyHistoryColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '16%',
                fixed: 'end',
                render: (caseStudy) => (
                    <TableListRowActions
                        view={
                            permissions.view && {
                                href: caseStudyUrls.show(caseStudy.id),
                                label: `Visualizar Estudo de Caso v${caseStudy.version}`,
                            }
                        }
                    />
                ),
            },
        ],
        [permissions.view],
    );

    return (
        <TableListCard aria-label="Histórico de Estudos de Caso do aluno">
            <TableListScroll aria-label="Tabela do histórico de Estudos de Caso">
                <TableListTable
                    columns={columns}
                    rows={caseStudies}
                    rowKey={(caseStudy) => caseStudy.id}
                    summary={summary}
                    emptyMessage="Nenhum Estudo de Caso encontrado."
                />
            </TableListScroll>
            <TableListSummary>{summary}</TableListSummary>
        </TableListCard>
    );
}

import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { caseStudyUrls } from '../CaseStudies.routes';
import type {
    CaseStudyListPermissions,
    CaseStudyPaginator,
    CaseStudyRow,
} from '../CaseStudies.types';
import { caseStudyColumns } from './caseStudyColumns';

interface CaseStudyListProps {
    caseStudies: CaseStudyPaginator;
    permissions: CaseStudyListPermissions;
    loading: boolean;
    processing: boolean;
    rowName: (caseStudy: CaseStudyRow) => string;
    onDelete: (caseStudy: CaseStudyRow) => void;
    onPageSelect: (page: number) => void;
}

/** Tabela paginada da listagem geral de Estudos de Caso. */
export default function CaseStudyList({
    caseStudies,
    permissions,
    loading,
    processing,
    rowName,
    onDelete,
    onPageSelect,
}: CaseStudyListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<CaseStudyRow>[]>(
        () => [
            ...caseStudyColumns,
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
                                label: `Visualizar ${rowName(caseStudy)}`,
                            }
                        }
                        // Concluídos não são editados; com PAEE vinculado, não são excluídos.
                        edit={
                            permissions.update &&
                            caseStudy.status !== 'completed' && {
                                href: caseStudyUrls.edit(caseStudy.id),
                                label: `Editar ${rowName(caseStudy)}`,
                            }
                        }
                        remove={
                            permissions.delete &&
                            !caseStudy.paees_count && {
                                label: `Excluir ${rowName(caseStudy)}`,
                                disabled: processing,
                                onClick: () => onDelete(caseStudy),
                            }
                        }
                    />
                ),
            },
        ],
        [permissions, processing, rowName, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de Estudos de Caso">
                <TableListTable
                    columns={columns}
                    rows={caseStudies.data}
                    rowKey={(caseStudy) => caseStudy.id}
                    page={caseStudies}
                    emptyMessage="Nenhum Estudo de Caso encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={caseStudies}
                disabled={loading}
                paginationLabel="Paginação de Estudos de Caso"
                onSelect={onPageSelect}
            />
        </>
    );
}

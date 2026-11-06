import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import { semesterLabel } from '../Semesters.constants';
import { semesterUrls } from '../Semesters.routes';
import type {
    SemesterListPermissions,
    SemesterPaginator,
    SemesterRecord,
} from '../Semesters.types';
import { semesterColumns } from './semesterColumns';
import '@styles/components/Semesters/List/SemesterList.css';

interface SemesterListProps {
    semesters: SemesterPaginator;
    permissions: SemesterListPermissions;
    loading: boolean;
    deleting: boolean;
    settingCurrent: boolean;
    onDelete: (semester: SemesterRecord) => void;
    onSetCurrent: (semester: SemesterRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function SemesterList({
    semesters,
    permissions,
    loading,
    deleting,
    settingCurrent,
    onDelete,
    onSetCurrent,
    onPageSelect,
}: SemesterListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<SemesterRecord>[]>(
        () => [
            ...semesterColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '22%',
                fixed: 'end',
                render: (semester) => {
                    const name = semesterLabel(semester);
                    // O semestre atual não pode ser excluído nem redefinido como atual.
                    const canSetCurrent = permissions.update && !semester.is_current;
                    const canDelete = permissions.delete && !semester.is_current;

                    return (
                        <TableListRowActions
                            emptyLabel="Sem ações"
                            view={
                                permissions.view && {
                                    href: semesterUrls.show(semester.id),
                                    label: `Visualizar semestre ${name}`,
                                }
                            }
                            remove={
                                canDelete && {
                                    label: `Excluir semestre ${name}`,
                                    disabled: deleting,
                                    onClick: () => onDelete(semester),
                                }
                            }
                        >
                            {canSetCurrent ? (
                                <Button
                                    size="sm"
                                    tone="success"
                                    iconOnly
                                    leftIconClass="fa fa-check"
                                    title="Definir como atual"
                                    aria-label={`Definir semestre ${name} como atual`}
                                    disabled={settingCurrent}
                                    onClick={() => onSetCurrent(semester)}
                                />
                            ) : null}
                        </TableListRowActions>
                    );
                },
            },
        ],
        [
            permissions.view,
            permissions.update,
            permissions.delete,
            deleting,
            settingCurrent,
            onDelete,
            onSetCurrent,
        ],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de semestres">
                <TableListTable
                    className="semesterList"
                    columns={columns}
                    rows={semesters.data}
                    rowKey={(semester) => semester.id}
                    rowClassName={(semester) =>
                        semester.is_current ? 'semesterList__row--current' : undefined
                    }
                    page={semesters}
                    emptyMessage="Nenhum semestre encontrado."
                />
            </TableListScroll>
            <TableListFooter
                page={semesters}
                disabled={loading}
                paginationLabel="Paginação de semestres"
                onSelect={onPageSelect}
            />
        </>
    );
}

import { usePage } from '@inertiajs/react';
import TeacherFilters from '@/components/Inclusion/Teachers/List/TeacherFilters';
import TeacherList from '@/components/Inclusion/Teachers/List/TeacherList';
import TeacherDeleteModal from '@/components/Inclusion/Teachers/TeacherDeleteModal';
import { emptyTeacherFilters } from '@/components/Inclusion/Teachers/Teachers.constants';
import { teacherBreadcrumb, teacherUrls } from '@/components/Inclusion/Teachers/Teachers.routes';
import type {
    TeacherIndexProps,
    TeacherRecord,
} from '@/components/Inclusion/Teachers/Teachers.types';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionTeachersIndexPage({
    teachers,
    filters: initialFilters,
    can,
}: TeacherIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: teacherUrls.index,
        initialFilters,
        emptyFilters: emptyTeacherFilters,
        failureText: 'Não foi possível atualizar a listagem de professores. Tente novamente.',
    });
    const removal = useConfirmedAction<TeacherRecord>({
        failureText: 'Não foi possível excluir o professor. Tente novamente.',
    });
    const permissionsAction = can.update ? (
        <Button
            href={teacherUrls.permissions}
            tone="default"
            labelIconClass="fa fa-shield"
            title="Permissões globais dos professores"
            aria-label="Permissões globais dos professores"
        >
            Permissões
        </Button>
    ) : undefined;

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', teacherUrls.destroy(removal.target.id));
        }
    }

    return (
        <TableListLayout
            title="Professores"
            subtitle="Gerencie o corpo docente e suas atribuições de disciplinas."
            breadcrumbItems={teacherBreadcrumb()}
            actions={permissionsAction}
            create={can.create && { href: teacherUrls.create, label: 'Cadastrar professor' }}
            listLabel="Listagem de professores"
            loading={filters.loading}
            loadingLabel="Atualizando professores"
            filters={
                <TeacherFilters
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <TeacherDeleteModal
                    target={removal.target ? { name: removal.target.person.name } : null}
                    context="list"
                    processing={removal.processing}
                    onClose={removal.close}
                    onConfirm={confirmRemoval}
                />
            }
        >
            <TeacherList
                teachers={teachers}
                permissions={can}
                loading={filters.loading}
                processing={removal.processing}
                onDelete={(teacher) => {
                    filters.cancelScheduled();
                    removal.open(teacher);
                }}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

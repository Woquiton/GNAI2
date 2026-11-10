import type { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import TeacherPortalLayout from '@/components/Navigation/TeacherPortalLayout/TeacherPortalLayout';
import TeacherAssignmentList from '@/components/TeacherPortal/List/TeacherAssignmentList';
import TeacherAssignmentFilters from '@/components/TeacherPortal/List/TeacherAssignmentFilters';
import { emptyTeacherAssignmentFilters } from '@/components/TeacherPortal/TeacherPortal.constants';
import {
    teacherPortalBreadcrumb,
    teacherPortalUrls,
} from '@/components/TeacherPortal/TeacherPortal.routes';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';
import type { TeacherPortalIndexProps } from '@/components/TeacherPortal/TeacherPortal.types';
import { teacherPortalIndexTour } from '@/components/TeacherPortal/teacherPortalTours';

export default function TeacherPortalIndexPage(props: TeacherPortalIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: teacherPortalUrls.index,
        initialFilters: props.filters,
        emptyFilters: emptyTeacherAssignmentFilters,
        failureText: 'Não foi possível atualizar seus alunos e adaptações. Tente novamente.',
    });

    return (
        <TableListLayout
            title="Meus Alunos e Adaptações (PEI)"
            subtitle="Aqui estão os alunos com PEI vinculado a você. Você pode editar a sua adaptação e consultar o perfil completo do aluno (em modo leitura)."
            breadcrumbItems={teacherPortalBreadcrumb()}
            tour={teacherPortalIndexTour}
            className="teacherPortal"
            listLabel="Alunos e adaptações vinculados a você"
            loading={filters.loading}
            loadingLabel="Atualizando meus alunos e adaptações"
            filters={
                <TeacherAssignmentFilters
                    values={filters.values}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
        >
            <TeacherAssignmentList
                assignments={props.assignments}
                loading={filters.loading}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}

TeacherPortalIndexPage.layout = (page: ReactNode): ReactNode => (
    <TeacherPortalLayout>{page}</TeacherPortalLayout>
);

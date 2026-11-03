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
import ConfirmActionModal from '@/components/UI/ConfirmActionModal/ConfirmActionModal';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionTeachersIndexPage({
    teachers,
    filters: initialFilters,
    can,
    assignmentCopy,
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
    // Cópia dos vínculos de todos os professores do semestre anterior para o semestre atual.
    const copy = useConfirmedAction<true>({
        failureText: 'Não foi possível copiar os vínculos dos professores. Tente novamente.',
    });
    const { source: copySource, target: copyTarget } = assignmentCopy;
    const canCopy = can.update && copySource !== null && copyTarget !== null;

    function confirmRemoval(): void {
        if (removal.target) {
            filters.cancelScheduled();
            removal.submit('delete', teacherUrls.destroy(removal.target.id));
        }
    }

    function confirmCopy(): void {
        if (copyTarget) {
            filters.cancelScheduled();
            copy.submit('post', teacherUrls.copyAllDisciplines, { semester_id: copyTarget.id });
        }
    }

    const copyAction = canCopy ? (
        <Button
            type="button"
            tone="list-action"
            labelIconClass="fa fa-copy"
            aria-label={`Copiar vínculos de ${copySource.label} para ${copyTarget.label}`}
            disabled={copy.processing}
            onClick={() => copy.open(true)}
        >
            {`Copiar vínculos de ${copySource.label}`}
        </Button>
    ) : undefined;

    return (
        <TableListLayout
            title="Professores"
            subtitle="Gerencie o corpo docente e suas atribuições de disciplinas."
            breadcrumbItems={teacherBreadcrumb()}
            create={can.create && { href: teacherUrls.create, label: 'Cadastrar professor' }}
            actions={copyAction}
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
                <>
                    <TeacherDeleteModal
                        target={removal.target ? { name: removal.target.person.name } : null}
                        context="list"
                        processing={removal.processing}
                        onClose={removal.close}
                        onConfirm={confirmRemoval}
                    />
                    {canCopy ? (
                        <ConfirmActionModal
                            open={copy.target !== null}
                            title="Copiar vínculos do semestre anterior"
                            message={`Copiar para ${copyTarget.label} as disciplinas que cada professor tinha em ${copySource.label}? Os vínculos já existentes em ${copyTarget.label} são mantidos.`}
                            details="Vínculos com cursos ou disciplinas inativos, ou com disciplinas que saíram da matriz, não são copiados."
                            processing={copy.processing}
                            confirmLabel="Copiar vínculos"
                            processingLabel="Copiando vínculos..."
                            onClose={copy.close}
                            onConfirm={confirmCopy}
                        />
                    ) : null}
                </>
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

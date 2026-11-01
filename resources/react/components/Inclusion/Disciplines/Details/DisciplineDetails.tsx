import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import TagList from '@/components/UI/TagList/TagList';
import type { DisciplineDetailsRecord } from '../Disciplines.types';

/** Informações gerais e cursos vinculados de uma disciplina. */
export default function DisciplineDetails({
    discipline,
}: {
    discipline: DisciplineDetailsRecord;
}): React.JSX.Element {
    return (
        <CardBox>
            <FormSection
                id="discipline-show-general"
                title="Informações Gerais"
                variant="inline"
                iconClass="fa fa-book"
            >
                <DetailGrid>
                    <DetailField label="Nome da Disciplina">
                        <strong>{discipline.name}</strong>
                    </DetailField>
                    <DetailField label="Status">
                        <TableLabel tone={discipline.is_active ? 'success' : 'danger'}>
                            {discipline.is_active ? 'Ativo' : 'Inativo'}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Descrição / Objetivos" wide preserveLineBreaks>
                        {discipline.description || 'Nenhuma descrição informada.'}
                    </DetailField>
                    <DetailField label="Cursos vinculados" wide>
                        <TagList
                            items={discipline.courses ?? []}
                            emptyMessage="Nenhum curso vinculado."
                        />
                    </DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}

import { useState } from 'react';
import {
    CheckboxListField,
    optionsFromNamed,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { CourseDisciplineOption } from '../Courses.types';

interface CourseCurriculumFieldsProps {
    editing: boolean;
    disciplines: CourseDisciplineOption[];
    value: number[];
    error?: string;
    disabled: boolean;
    onChange: (ids: number[]) => void;
}

/**
 * Matriz curricular: busca local e seleção das disciplinas ativas. A busca só filtra a lista
 * exibida; as disciplinas já marcadas continuam selecionadas.
 */
export default function CourseCurriculumFields({
    editing,
    disciplines,
    value,
    error,
    disabled,
    onChange,
}: CourseCurriculumFieldsProps): React.JSX.Element {
    const [search, setSearch] = useState('');
    const term = search.toLowerCase().trim();
    const visibleDisciplines = term
        ? disciplines.filter((discipline) => discipline.name.toLowerCase().includes(term))
        : disciplines;
    const emptyMessage = term
        ? 'Nenhuma disciplina encontrada com esse termo.'
        : 'Nenhuma disciplina ativa disponível.';

    return (
        <FormSection
            id="course-curriculum"
            title={
                editing
                    ? 'Matriz Curricular (Selecione as Disciplinas)'
                    : 'Matriz Curricular Inicial'
            }
            variant="inline"
            iconClass="fa fa-book"
        >
            <FormGrid columns={2}>
                <FormGridWide>
                    <TextInputField
                        id="course-discipline-search"
                        label="Buscar disciplina"
                        type="search"
                        placeholder="Digite o nome da disciplina..."
                        autoComplete="off"
                        aria-controls="course-disciplines"
                        value={search}
                        onChange={setSearch}
                    />
                </FormGridWide>
                <FormGridWide>
                    <CheckboxListField
                        id="course-disciplines"
                        name="discipline_ids"
                        label="Disciplinas do curso"
                        options={optionsFromNamed(visibleDisciplines)}
                        value={value}
                        error={error}
                        disabled={disabled}
                        onChange={onChange}
                    >
                        {!visibleDisciplines.length ? (
                            <span role="status">{emptyMessage}</span>
                        ) : null}
                    </CheckboxListField>
                </FormGridWide>
            </FormGrid>
        </FormSection>
    );
}

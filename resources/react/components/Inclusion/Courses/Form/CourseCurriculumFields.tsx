import { useState } from 'react';
import {
    CheckboxListField,
    optionsFromNamed,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { coursePeriodOptions } from '@/components/Inclusion/coursePeriods';
import type { CourseDisciplineOption } from '../Courses.types';

interface CourseCurriculumFieldsProps {
    editing: boolean;
    disciplines: CourseDisciplineOption[];
    value: number[];
    periods: Record<string, string>;
    maxCoursePeriod: number;
    error?: string;
    periodErrors: Record<string, string | undefined>;
    disabled: boolean;
    onChange: (ids: number[]) => void;
    onPeriodChange: (disciplineId: number, period: string) => void;
}

/**
 * Matriz curricular: busca local e seleção das disciplinas ativas, com o período do curso de cada
 * disciplina marcada. A busca só filtra a lista exibida; as disciplinas já marcadas continuam
 * selecionadas.
 */
export default function CourseCurriculumFields({
    editing,
    disciplines,
    value,
    periods,
    maxCoursePeriod,
    error,
    periodErrors,
    disabled,
    onChange,
    onPeriodChange,
}: CourseCurriculumFieldsProps): React.JSX.Element {
    const [search, setSearch] = useState('');
    const term = search.toLowerCase().trim();
    const visibleDisciplines = term
        ? disciplines.filter((discipline) => discipline.name.toLowerCase().includes(term))
        : disciplines;
    const emptyMessage = term
        ? 'Nenhuma disciplina encontrada com esse termo.'
        : 'Nenhuma disciplina ativa disponível.';
    const selectedDisciplines = disciplines.filter((discipline) => value.includes(discipline.id));
    const periodOptions = coursePeriodOptions(maxCoursePeriod);

    return (
        <>
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
            {selectedDisciplines.length ? (
                <FormSection
                    id="course-curriculum-periods"
                    title="Períodos das Disciplinas"
                    variant="inline"
                    iconClass="fa fa-list-ol"
                >
                    <p>
                        Informe em qual período (semestre ou série) do curso cada disciplina é
                        cursada. O PEI usa essa informação para sugerir as disciplinas do período do
                        aluno.
                    </p>
                    <FormGrid columns={3}>
                        {selectedDisciplines.map((discipline) => (
                            <SelectInputField
                                key={discipline.id}
                                id={`course-discipline-period-${discipline.id}`}
                                name={`discipline_periods[${discipline.id}]`}
                                label={discipline.name}
                                options={periodOptions}
                                placeholder={null}
                                searchable={false}
                                disabled={disabled}
                                value={periods[String(discipline.id)] ?? ''}
                                error={periodErrors[String(discipline.id)]}
                                onChange={(period) => onPeriodChange(discipline.id, period)}
                            />
                        ))}
                    </FormGrid>
                </FormSection>
            ) : null}
        </>
    );
}

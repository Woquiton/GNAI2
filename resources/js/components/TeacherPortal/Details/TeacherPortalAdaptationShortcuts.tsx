import { useState } from 'react';
import { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import Button from '@/components/UI/Button/Button';
import Modal from '@/components/UI/Modal/Modal';
import { teacherPortalUrls } from '../TeacherPortal.routes';
import type { TeacherPortalPeiDiscipline } from '../TeacherPortal.types';

/** Lista compacta das disciplinas do professor para iniciar ou editar adaptações. */
export default function TeacherPortalAdaptationShortcuts({
    disciplines,
    mode,
}: {
    disciplines: TeacherPortalPeiDiscipline[];
    mode: 'start' | 'edit';
}): React.JSX.Element {
    const [open, setOpen] = useState(false);
    const starting = mode === 'start';
    const title = starting ? 'Adaptações para iniciar' : 'Adaptações para editar';
    const label = `${title} (${disciplines.length})`;
    const action = starting ? 'Iniciar minha adaptação' : 'Editar minha adaptação';
    const tone = starting ? 'create' : 'warning';
    const icon = starting ? 'fa fa-plus' : 'fa fa-pencil';
    const description = starting
        ? 'Escolha a sua disciplina para abrir o planejamento e iniciar a adaptação.'
        : 'Escolha a sua disciplina para abrir o planejamento e editar a adaptação.';

    return (
        <>
            <Button
                tone={tone}
                leftIconClass={icon}
                label={label}
                title={label}
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={() => setOpen(true)}
            />
            <Modal
                open={open}
                title={title}
                effect="fadein"
                onClose={() => setOpen(false)}
            >
                <p>{description}</p>
                <FormStack>
                    {disciplines.map((discipline) => {
                        const name = discipline.discipline_name ?? 'Disciplina não informada';

                        return (
                            <Button
                                key={discipline.id}
                                href={teacherPortalUrls.editDiscipline(discipline.id)}
                                tone={tone}
                                leftIconClass={icon}
                                label={name}
                                title={`${action} de ${name}`}
                                aria-label={`${action} de ${name}`}
                                block
                            />
                        );
                    })}
                </FormStack>
            </Modal>
        </>
    );
}

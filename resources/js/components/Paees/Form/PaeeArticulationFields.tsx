import { RichTextField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { PAEE_TOUR_TARGETS } from '../paeeTours';
import type { PaeeFormSectionProps, PaeeTextField } from './PaeeForm.types';

const articulationFields: Array<{
    name: PaeeTextField;
    label: string;
    hint?: string;
    wide?: boolean;
}> = [
    {
        name: 'school_professionals_orientation',
        label: 'Orientação aos profissionais da escola',
    },
    {
        name: 'common_teachers_articulation',
        label: 'Articulação com professores do ensino comum',
    },
    {
        name: 'family_articulation',
        label: 'Como a família será envolvida',
        hint: 'Planeje a forma de contato e o que será combinado com a família.',
    },
    { name: 'intersectoral_articulation', label: 'Articulação intersetorial' },
    { name: 'training_demands', label: 'Demandas de formação', wide: true },
];

/** Orientações à escola e articulações com professores, família e outros setores. */
export default function PaeeArticulationFields({
    richText,
}: PaeeFormSectionProps): React.JSX.Element {
    return (
        <FormSection
            id="paee-articulations"
            tourTarget={PAEE_TOUR_TARGETS.articulations}
            title="Articulações e Orientações"
            variant="inline"
            iconClass="fa fa-handshake-o"
        >
            <FormGrid columns={2}>
                {articulationFields.map((field) => {
                    const control = (
                        <RichTextField
                            {...richText(field.name)}
                            label={field.label}
                            hint={field.hint}
                            hintLabel={
                                field.hint
                                    ? `Mais informações sobre ${field.label.toLowerCase()}`
                                    : undefined
                            }
                        />
                    );

                    return field.wide ? (
                        <FormGridWide key={field.name}>{control}</FormGridWide>
                    ) : (
                        <div key={field.name}>{control}</div>
                    );
                })}
            </FormGrid>
        </FormSection>
    );
}

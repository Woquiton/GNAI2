import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { CaseStudyRichTextSectionProps } from './CaseStudyForm.types';
import CaseStudyRichTextField from './CaseStudyRichTextField';

/** Observação do estudante, escutas e informações complementares. */
export default function CaseStudyListeningFields(
    sectionProps: CaseStudyRichTextSectionProps,
): React.JSX.Element {
    return (
        <FormSection
            id="case-study-listening"
            title="Escuta e Observação"
            variant="inline"
            iconClass="fa fa-comments-o"
        >
            <FormGrid columns={2}>
                <FormGridWide>
                    <FormGrid columns={3}>
                        <CaseStudyRichTextField
                            {...sectionProps}
                            name="student_observation"
                            label="Observação do estudante"
                            required
                        />
                        <CaseStudyRichTextField
                            {...sectionProps}
                            name="student_family_listening"
                            label="Escuta do estudante/família"
                            required
                        />
                        <CaseStudyRichTextField
                            {...sectionProps}
                            name="teachers_listening"
                            label="Escuta dos professores"
                            required
                        />
                    </FormGrid>
                </FormGridWide>
                <CaseStudyRichTextField
                    {...sectionProps}
                    name="other_info"
                    label="Outras informações"
                    compact
                />
                <CaseStudyRichTextField
                    {...sectionProps}
                    name="care_network_notes"
                    label="Observações da rede de cuidado"
                    compact
                />
            </FormGrid>
        </FormSection>
    );
}

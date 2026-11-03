import { useForm } from '@inertiajs/react';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import { PEI_CREATE_FAILURE_TEXT } from '../Peis.constants';
import { peiUrls } from '../Peis.routes';
import type { PeiCreateProps } from '../Peis.types';
import { PEI_TOUR_TARGETS } from '../peiTours';

/** Confirmação da geração do PEI com os dados vigentes do aluno; não há campos editáveis. */
export default function PeiCreateForm({
    student,
    course,
    semester,
}: PeiCreateProps): React.JSX.Element {
    const form = useForm({});
    const submission = useFormSubmission(form);
    const studentName = student.person?.name ?? '';
    const status = form.processing ? 'Gerando PEI…' : undefined;

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        submission.submit({
            url: peiUrls.store(student.id),
            failureText: PEI_CREATE_FAILURE_TEXT,
        });
    }

    return (
        <FormLayout
            ref={submission.formRef}
            aria-label="Gerar novo PEI"
            aria-busy={form.processing}
            onSubmit={submit}
        >
            <CardBox>
                <FormSection
                    id="pei-create-information"
                    tourTarget={PEI_TOUR_TARGETS.createInformation}
                    title="Informações do PEI"
                    variant="inline"
                    iconClass="fa fa-file-text-o"
                >
                    <DetailGrid>
                        <DetailField label="Estudante">{studentName}</DetailField>
                        <DetailField label="Curso Vinculado">{course.name}</DetailField>
                        <DetailField label="Semestre Vigente">{semester.label}</DetailField>
                    </DetailGrid>
                </FormSection>
            </CardBox>
            <FormActions status={status} tourTarget={PEI_TOUR_TARGETS.createActions}>
                <Button
                    href={peiUrls.studentIndex(student.id)}
                    tone="cancel"
                    label="Cancelar"
                    aria-label="Cancelar e voltar aos PEIs do aluno"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    label="Gerar PEI"
                    title="Confirmar e gerar PEI"
                    aria-label="Confirmar e gerar PEI"
                    disabled={form.processing}
                />
            </FormActions>
        </FormLayout>
    );
}

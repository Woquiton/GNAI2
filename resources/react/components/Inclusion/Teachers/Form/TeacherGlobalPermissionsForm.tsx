import { useForm } from '@inertiajs/react';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FieldError from '@/components/Forms/FormField/FieldError';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import { teacherUrls } from '@/components/Inclusion/Teachers/Teachers.routes';
import type { TeacherGlobalPermissionsProps } from '@/components/Inclusion/Teachers/Teachers.types';
import TeacherSelectionGroup from './TeacherSelectionGroup';

export default function TeacherGlobalPermissionsForm({
    permissions,
    globalPermissionsIds,
}: TeacherGlobalPermissionsProps): React.JSX.Element {
    const groups = Object.entries(permissions);
    const form = useForm({ permissions: globalPermissionsIds.map(Number) });
    const submission = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;
    const itemErrors = Object.fromEntries(
        form.data.permissions.map((id, index) => [id, errors[`permissions.${index}`]]),
    );

    function toggle(ids: number[], checked: boolean): void {
        form.setData(
            'permissions',
            checked
                ? [...new Set([...form.data.permissions, ...ids])]
                : form.data.permissions.filter((id) => !ids.includes(id)),
        );
    }

    return (
        <FormLayout
            ref={submission.formRef}
            aria-label="Permissões globais dos professores"
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                submission.submit({
                    url: teacherUrls.updatePermissions,
                    method: 'put',
                    failureText:
                        'Não foi possível atualizar as permissões dos professores. Tente novamente.',
                });
            }}
        >
            <CardBox>
                <FormSection
                    id="teacher-global-permissions"
                    title="Matriz de acesso do docente"
                    variant="inline"
                    iconClass="fa fa-shield"
                >
                    <InlineAlert variant="info">
                        Alterações nesta tela impactam imediatamente o acesso de todos os
                        professores cadastrados no sistema.
                    </InlineAlert>
                    <FieldError id="teacher-permissions" error={errors.permissions} />
                    {groups.length === 0 ? <p>Nenhuma permissão cadastrada.</p> : null}
                </FormSection>
                {groups.map(([group, options], index) => (
                    <TeacherSelectionGroup
                        key={group}
                        id={`teacher-permissions-${index}`}
                        title={group.replace(/[-_]/g, ' ')}
                        iconClass="fa fa-folder-o"
                        name="permissions"
                        options={options}
                        selected={form.data.permissions}
                        error={errors.permissions}
                        errorId="teacher-permissions-error"
                        itemErrors={itemErrors}
                        disabled={form.processing}
                        onChange={toggle}
                    />
                ))}
            </CardBox>
            <FormActions status={form.processing ? 'Salvando permissões...' : undefined}>
                <Button
                    href={teacherUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    label="Salvar"
                    title="Salvar permissões globais dos professores"
                    disabled={form.processing}
                />
            </FormActions>
        </FormLayout>
    );
}

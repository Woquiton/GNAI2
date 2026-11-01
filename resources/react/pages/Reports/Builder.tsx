import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FormField from '@/components/Forms/FormField/FormField';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import SelectField from '@/components/Forms/SelectField/SelectField';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import '@/components/Forms/RemovableField/RemovableField.css';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import ReportColumns from './ReportColumns';
import ReportFilters from './ReportFilters';
import ReportPreview from './ReportPreview';
import useReportBuilder from './useReportBuilder';
import ReportRelations from './ReportRelations';
import type { ReportPermissions } from './Reports.types';
import './Reports.css';

export default function ReportsBuilderPage({ can }: { can: ReportPermissions }): React.JSX.Element {
    const report = useReportBuilder(can);
    const busy = report.operation !== null;
    const unavailable = !can.sources || !can.metadata;
    const relations = report.metadata?.relations ?? [];
    const status = report.loadingSources ? 'Carregando assuntos...'
        : report.loadingMetadata ? 'Carregando informações...'
        : report.operation === 'run' ? 'Gerando prévia...'
        : report.operation === 'pdf' ? 'Gerando PDF...'
        : report.operation === 'copy' ? 'Copiando tabela...' : undefined;
    return (
        <BusinessPage
            title="Gerador de Relatórios e Consultas"
            subtitle="Monte seu relatório escolhendo os dados, as informações e os filtros que deseja visualizar."
            breadcrumbItems={[{ label: 'Home', href: '/auth/dashboard' }, { label: 'Relatórios' }]}
            className="reportBuilder"
        >
            <FormLayout
                aria-label="Configuração do relatório"
                aria-busy={busy || report.loadingSources || report.loadingMetadata}
                onSubmit={event => {
                    event.preventDefault();
                    void report.perform('run');
                }}
            >
                <CardBox>
                    {unavailable ? (
                        <InlineAlert variant="warning">
                            Você não tem permissão para consultar os assuntos e informações dos relatórios.
                        </InlineAlert>
                    ) : null}
                    <fieldset disabled={busy || unavailable} className="reportBuilder__fields">
                        <FormSection
                            variant="inline"
                            title="Assunto do relatório"
                            iconClass="fa fa-bar-chart"
                            titleAddon={
                                <InfoTooltip
                                    text="Primeiro, escolha sobre o que será o relatório. Depois, mostraremos as informações que você poderá incluir."
                                    label="Mais informações sobre assunto do relatório"
                                />
                            }
                        >
                            <div className="reportBuilder__source">
                                <FormField id="report-source" label="Assunto do relatório" requiredIndicator error={report.errors.source}>
                                    <SelectField
                                        id="report-source"
                                        name="source"
                                        label="Assunto do relatório"
                                        required
                                        value={report.source}
                                        options={report.sources.map(item => ({ value: item.key, label: item.label.startsWith('database.models.') ? item.key : item.label }))}
                                        disabled={report.loadingSources}
                                        aria-invalid={Boolean(report.errors.source)}
                                        aria-describedby={report.errors.source ? 'report-source-error' : undefined}
                                        onChange={event => report.setSource(event.target.value)}
                                    />
                                </FormField>
                                {report.errors.source ? (
                                    <Button
                                        label="Tentar novamente"
                                        tone="cancel"
                                        leftIconClass="fa fa-refresh"
                                        disabled={report.loadingSources || report.loadingMetadata}
                                        onClick={report.retry}
                                    />
                                ) : null}
                            </div>
                            {!unavailable && !report.loadingSources && !report.sources.length && !report.errors.source ? (
                                <p className="reportBuilder__hint">Nenhum assunto de relatório disponível.</p>
                            ) : null}
                        </FormSection>
                        <FormSection
                            variant="inline"
                            title="Informações do relatório"
                            iconClass="fa fa-list"
                            titleAddon={
                                <InfoTooltip
                                    text="Marque as informações principais e complementares que deseja visualizar."
                                    label="Mais informações sobre informações do relatório"
                                />
                            }
                        >
                            {report.metadata ? (
                                <ReportColumns
                                    id="report-columns"
                                    label="Informações principais"
                                    options={report.metadata.columns}
                                    selected={report.columns}
                                    errors={report.errors}
                                    onChange={report.toggleColumn}
                                />
                            ) : (
                                <p className="reportBuilder__hint">
                                    {report.loadingMetadata
                                        ? 'Carregando informações...'
                                        : 'Nenhum assunto selecionado.'}
                                </p>
                            )}
                        </FormSection>
                        {report.metadata && relations.length ? (
                            <ReportRelations
                                key={report.metadata.key}
                                relations={relations}
                                added={report.addedRelations}
                                selected={report.columns}
                                canAdd={can.configureRelations}
                                onAdd={report.addRelation}
                                onRemove={report.removeRelation}
                                onToggle={report.toggleColumn}
                            />
                        ) : null}
                        <FormSection
                            variant="inline"
                            title="Critérios de busca"
                            iconClass="fa fa-filter"
                            titleAddon={
                                <InfoTooltip
                                    text="Esta etapa é opcional. Use critérios para encontrar informações específicas, como um nome, uma data ou uma situação."
                                    label="Mais informações sobre critérios de busca"
                                />
                            }
                        >
                            <ReportFilters
                                filters={report.filters}
                                definitions={report.definitions}
                                errors={report.errors}
                                onChange={report.updateFilter}
                                onRemove={report.removeFilter}
                            />
                            <div className="reportBuilder__relatedOnly">
                                <ChoiceControl
                                    type="checkbox"
                                    id="report-related-only"
                                    tone="purple"
                                    label="Mostrar somente vínculos correspondentes à busca"
                                    checked={report.relatedOnly}
                                    onChange={report.setRelatedOnly}
                                />
                                <InfoTooltip
                                    text="Nas informações complementares, mostra somente os itens que correspondem aos critérios de busca aplicados."
                                    label="Mais informações sobre a filtragem dos vínculos"
                                />
                            </div>
                            {report.errors.filter_related_values ? <p className="formField__error">{report.errors.filter_related_values}</p> : null}
                            <Button
                                label="Adicionar critério de busca"
                                tone="white"
                                className="removableField__add"
                                labelIconClass="fa fa-plus"
                                disabled={!report.definitions.length}
                                onClick={report.addFilter}
                            />
                        </FormSection>
                    </fieldset>
                    <FormSection
                        variant="inline"
                        title="Prévia do relatório"
                        iconClass="fa fa-table"
                        titleAddon={
                            <InfoTooltip
                                text="Escolha as informações e clique em Gerar prévia. Confira o conteúdo antes de exportar ou copiar a tabela."
                                label="Mais informações sobre prévia do relatório"
                            />
                        }
                    >
                        <ReportPreview result={report.result} busy={busy} onCopy={() => void report.copy()} />
                    </FormSection>
                </CardBox>
                <FormActions
                    status={status}
                    secondary={can.pdf ? (
                        <Button
                            label="PDF"
                            tone="dark-red"
                            leftIconClass="fa fa-file-pdf-o"
                            title="Abrir relatório em PDF em uma nova aba"
                            disabled={busy || !report.metadata || unavailable}
                            onClick={() => void report.perform('pdf')}
                        />
                    ) : undefined}
                >
                    {can.run ? (
                        <Button
                            type="submit"
                            label="Gerar prévia"
                            tone="save"
                            leftIconClass="fa fa-table"
                            disabled={busy || !report.metadata || unavailable}
                        />
                    ) : null}
                </FormActions>
            </FormLayout>
        </BusinessPage>
    );
}

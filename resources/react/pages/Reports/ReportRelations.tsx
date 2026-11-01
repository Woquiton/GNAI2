import { useState } from 'react';
import FormSection from '@/components/Forms/FormSection/FormSection';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import '@/components/Forms/RemovableField/RemovableField.css';
import FormField from '@/components/Forms/FormField/FormField';
import SelectField from '@/components/Forms/SelectField/SelectField';
import Button from '@/components/UI/Button/Button';
import ReportColumns from './ReportColumns';
import type { ReportRelation } from './Reports.types';

export default function ReportRelations({ relations, added, selected, canAdd, onAdd, onRemove, onToggle }: {
    relations: ReportRelation[];
    added: ReportRelation[];
    selected: string[];
    canAdd: boolean;
    onAdd: (name: string) => void;
    onRemove: (name: string) => void;
    onToggle: (key: string, checked: boolean) => void;
}): React.JSX.Element {
    const [relation, setRelation] = useState('');
    const remaining = relations.filter(item => !added.some(value => value.name === item.name));
    return (
        <FormSection
            id="report-relations"
            variant="inline"
            title="Informações complementares"
            iconClass="fa fa-link"
            titleAddon={
                <InfoTooltip
                    text="Opcional. Inclua informações associadas ao assunto escolhido, como responsáveis, documentos ou registros relacionados."
                    label="Mais informações sobre informações complementares"
                />
            }
        >
            {canAdd ? (
                <div className="reportBuilder__source">
                    <FormField id="report-relation" label="Adicionar informação complementar">
                        <SelectField
                            id="report-relation"
                            name="relation"
                            label="Adicionar informação complementar"
                            value={relation}
                            options={remaining.map(item => ({ value: item.name, label: item.label }))}
                            onChange={event => setRelation(event.target.value)}
                        />
                    </FormField>
                    <Button
                        label="Adicionar"
                        tone="white"
                        className="removableField__add"
                        labelIconClass="fa fa-plus"
                        disabled={!remaining.some(item => item.name === relation)}
                        onClick={() => {
                            onAdd(relation);
                            setRelation('');
                        }}
                    />
                </div>
            ) : null}
            {added.map(item => (
                <section key={item.name} className="reportBuilder__relation" aria-label={item.label}>
                    <div className="reportBuilder__relationHeader">
                        <h3>{item.label}</h3>
                        <Button
                            tone="dark-red"
                            iconOnly
                            leftIconClass="fa fa-times"
                            aria-label={`Remover informações de ${item.label}`}
                            title={`Remover informações de ${item.label}`}
                            onClick={() => onRemove(item.name)}
                        />
                    </div>
                    <ReportColumns
                        id={`report-relation-${item.name}`}
                        label={item.label}
                        options={Object.fromEntries(Object.entries(item.columns).map(([key, label]) => [`${item.name}.${key}`, label]))}
                        selected={selected}
                        errors={{}}
                        onChange={onToggle}
                    />
                    {item.pivot && Object.keys(item.pivot.columns).length ? (
                        <>
                            <div className="reportBuilder__groupTitle">
                                Informações do vínculo
                                <InfoTooltip
                                    text="Informações adicionais que pertencem ao vínculo entre os registros."
                                    label={`Mais informações sobre o vínculo de ${item.label}`}
                                />
                            </div>
                            <ReportColumns
                                id={`report-pivot-${item.name}`}
                                label={`${item.label}: informações do vínculo`}
                                options={Object.fromEntries(Object.entries(item.pivot.columns).map(([key, label]) => [`${item.name}.pivot.${key}`, label]))}
                                selected={selected}
                                errors={{}}
                                onChange={onToggle}
                            />
                        </>
                    ) : null}
                </section>
            ))}
        </FormSection>
    );
}

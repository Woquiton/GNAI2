import { useState } from 'react';
import { SelectInputField } from '@/components/Forms/FormFields/FormFields';
import FormSection from '@/components/Forms/FormSection/FormSection';
import '@/components/Forms/RemovableField/RemovableField.css';
import Button from '@/components/UI/Button/Button';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import type { ReportOptions, ReportRelation } from '../Reports.types';
import ReportColumns from './ReportColumns';
import { REPORT_TOUR_TARGETS } from '../reportTours';

/** Prefixa as chaves das colunas com o caminho da relação, como o backend espera. */
function prefixedOptions(options: ReportOptions, prefix: string): ReportOptions {
    return Object.fromEntries(
        Object.entries(options).map(([key, label]) => [`${prefix}.${key}`, label]),
    );
}

function AddedRelation({
    relation,
    selected,
    onRemove,
    onToggle,
}: {
    relation: ReportRelation;
    selected: string[];
    onRemove: (name: string) => void;
    onToggle: (key: string, checked: boolean) => void;
}): React.JSX.Element {
    const removeLabel = `Remover informações de ${relation.label}`;
    const pivotColumns = relation.pivot?.columns ?? {};
    const hasPivot = Object.keys(pivotColumns).length > 0;

    return (
        <section className="reportBuilder__relation" aria-label={relation.label}>
            <div className="reportBuilder__relationHeader">
                <h3>{relation.label}</h3>
                <Button
                    tone="dark-red"
                    iconOnly
                    leftIconClass="fa fa-times"
                    aria-label={removeLabel}
                    title={removeLabel}
                    onClick={() => onRemove(relation.name)}
                />
            </div>
            <ReportColumns
                id={`report-relation-${relation.name}`}
                label={relation.label}
                options={prefixedOptions(relation.columns, relation.name)}
                selected={selected}
                errors={{}}
                onChange={onToggle}
            />
            {hasPivot ? (
                <>
                    <div className="reportBuilder__groupTitle">
                        Informações do vínculo
                        <InfoTooltip
                            text="Informações adicionais que pertencem ao vínculo entre os registros."
                            label={`Mais informações sobre o vínculo de ${relation.label}`}
                        />
                    </div>
                    <ReportColumns
                        id={`report-pivot-${relation.name}`}
                        label={`${relation.label}: informações do vínculo`}
                        options={prefixedOptions(pivotColumns, `${relation.name}.pivot`)}
                        selected={selected}
                        errors={{}}
                        onChange={onToggle}
                    />
                </>
            ) : null}
        </section>
    );
}

/** Seção "Informações complementares": adiciona relações do assunto e suas colunas. */
export default function ReportRelationsSection({
    relations,
    added,
    selected,
    canAdd,
    onAdd,
    onRemove,
    onToggle,
}: {
    relations: ReportRelation[];
    added: ReportRelation[];
    selected: string[];
    canAdd: boolean;
    onAdd: (name: string) => void;
    onRemove: (name: string) => void;
    onToggle: (key: string, checked: boolean) => void;
}): React.JSX.Element {
    const [relation, setRelation] = useState('');
    const remaining = relations.filter((item) => !added.some((value) => value.name === item.name));
    const relationOptions = remaining.map((item) => ({ value: item.name, label: item.label }));
    const canSubmit = remaining.some((item) => item.name === relation);

    return (
        <FormSection
            id="report-relations"
            tourTarget={REPORT_TOUR_TARGETS.relations}
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
                    <SelectInputField
                        id="report-relation"
                        name="relation"
                        label="Adicionar informação complementar"
                        value={relation}
                        options={relationOptions}
                        onChange={setRelation}
                    />
                    <Button
                        label="Adicionar"
                        tone="white"
                        className="removableField__add"
                        labelIconClass="fa fa-plus"
                        disabled={!canSubmit}
                        onClick={() => {
                            onAdd(relation);
                            setRelation('');
                        }}
                    />
                </div>
            ) : null}
            {added.map((item) => (
                <AddedRelation
                    key={item.name}
                    relation={item}
                    selected={selected}
                    onRemove={onRemove}
                    onToggle={onToggle}
                />
            ))}
        </FormSection>
    );
}

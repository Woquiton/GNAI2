import { useEffect, useState } from 'react';
import Button from '@/components/UI/Button/Button';
import SegmentedControl from '@/components/UI/SegmentedControl/SegmentedControl';
import Modal from '@/components/UI/Modal/Modal';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { AuditField, AuditRecord, AuditView } from '../Audit.types';
import { auditDateTime, auditEventTone } from '../Audit.utils';
import { AUDIT_TOUR_TARGETS } from '../auditTours';
import './AuditRecordModal.css';

function FieldValue({ value }: { value: string | null }): React.JSX.Element {
    return value === null || value === '' ? (
        <span className="auditRecord__empty">vazio</span>
    ) : (
        <>{value}</>
    );
}

function ListChanges({ field }: { field: AuditField }): React.JSX.Element {
    const added = field.added ?? [];
    const removed = field.removed ?? [];

    if (!added.length && !removed.length) {
        return <span className="auditRecord__empty">sem itens</span>;
    }

    return (
        <ul className="auditRecord__list">
            {added.map((item) => (
                <li
                    key={`added-${item}`}
                    className="auditRecord__listItem auditRecord__listItem--added"
                >
                    <i className="fa fa-plus" aria-hidden="true" />
                    <span className="auditRecord__srOnly">Adicionado: </span>
                    {item}
                </li>
            ))}
            {removed.map((item) => (
                <li
                    key={`removed-${item}`}
                    className="auditRecord__listItem auditRecord__listItem--removed"
                >
                    <i className="fa fa-minus" aria-hidden="true" />
                    <span className="auditRecord__srOnly">Removido: </span>
                    {item}
                </li>
            ))}
        </ul>
    );
}

/** Células de valor de um campo: lista de itens, antes/depois (alteração) ou valor único. */
function FieldCells({
    field,
    record,
    comparing,
}: {
    field: AuditField;
    record: AuditRecord;
    comparing: boolean;
}): React.JSX.Element {
    if (field.format === 'list') {
        return (
            <td colSpan={comparing ? 2 : 1}>
                <ListChanges field={field} />
            </td>
        );
    }

    if (comparing) {
        return (
            <>
                <td className="auditRecord__before">
                    <FieldValue value={field.before} />
                </td>
                <td className="auditRecord__after">
                    <FieldValue value={field.after} />
                </td>
            </>
        );
    }

    return (
        <td>
            <FieldValue value={record.event === 'deleted' ? field.before : field.after} />
        </td>
    );
}

function PlainFields({ record }: { record: AuditRecord }): React.JSX.Element {
    const fields = record.plain.fields;
    const comparing = record.event === 'updated';
    const valueHeading = record.event === 'deleted' ? 'Valor ao excluir' : 'Valor registrado';

    if (!fields.length) {
        return (
            <p className="auditRecord__noFields" data-tour={AUDIT_TOUR_TARGETS.modalContent}>
                Nenhum campo registrado.
            </p>
        );
    }

    return (
        <div className="auditRecord__tableWrap" data-tour={AUDIT_TOUR_TARGETS.modalContent}>
            <table className="auditRecord__table">
                <thead>
                    <tr>
                        <th scope="col">Campo</th>
                        {comparing ? (
                            <>
                                <th scope="col">Antes</th>
                                <th scope="col">Depois</th>
                            </>
                        ) : (
                            <th scope="col">{valueHeading}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {fields.map((field) => (
                        <tr key={field.field}>
                            <th scope="row">{field.label}</th>
                            <FieldCells field={field} record={record} comparing={comparing} />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/**
 * Detalhe de um registro: linguagem simples por padrão e, pelo alternador, o log técnico cru.
 */
export default function AuditRecordModal({
    record,
    onClose,
}: {
    record: AuditRecord | null;
    onClose: () => void;
}): React.JSX.Element {
    const [view, setView] = useState<AuditView>('plain');
    const recordId = record?.id;

    // Cada registro abre na linguagem simples.
    useEffect(() => {
        if (recordId !== undefined) setView('plain');
    }, [recordId]);

    return (
        <Modal
            open={record !== null}
            title={record?.plain.summary ?? 'Registro de auditoria'}
            size="large"
            effect="fadein"
            contentClassName="auditRecordModal"
            onClose={onClose}
            footer={
                <div className="auditRecord__footer" data-tour={AUDIT_TOUR_TARGETS.modalFooter}>
                    <Button
                        tone="cancel"
                        label="Fechar"
                        aria-label="Fechar detalhes do registro"
                        onClick={onClose}
                    />
                </div>
            }
        >
            {record ? (
                <div className="auditRecord">
                    <div className="auditRecord__meta">
                        <div
                            className="auditRecord__badges"
                            data-tour={AUDIT_TOUR_TARGETS.modalSummary}
                        >
                            <TableLabel tone={auditEventTone(record.event)}>
                                {record.plain.event}
                            </TableLabel>
                            <TableLabel tone="inverse">{record.plain.type}</TableLabel>
                            <time dateTime={record.date ?? undefined}>
                                {auditDateTime(record.date)}
                            </time>
                        </div>
                        <SegmentedControl<AuditView>
                            label="Forma de exibição"
                            value={view}
                            onChange={setView}
                            tourTarget={AUDIT_TOUR_TARGETS.modalViews}
                            options={[
                                {
                                    value: 'plain',
                                    label: 'Formatado',
                                    iconClass: 'fa fa-align-left',
                                },
                                {
                                    value: 'technical',
                                    label: 'Log técnico',
                                    iconClass: 'fa fa-code',
                                },
                            ]}
                        />
                    </div>
                    {view === 'plain' ? (
                        <PlainFields record={record} />
                    ) : (
                        <pre
                            className="auditRecord__technical"
                            data-tour={AUDIT_TOUR_TARGETS.modalContent}
                            tabIndex={0}
                            aria-label="Log técnico do registro"
                        >
                            {JSON.stringify(record.technical, null, 2)}
                        </pre>
                    )}
                </div>
            ) : null}
        </Modal>
    );
}

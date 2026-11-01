import { useState } from 'react';
import FormField from '@/components/Forms/FormField/FormField';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import SelectField from '@/components/Forms/SelectField/SelectField';
import TextInput from '@/components/Forms/TextInput/TextInput';
import {
  TableListClearButton,
  TableListFilterActions,
} from '@/components/Tables/TableList/TableList';

export interface StudentRecordFilterField {
  name: string;
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export function useStudentRecordFilters<Key extends string>(keys: readonly Key[]) {
  const emptyValues = (): Record<Key, string> => Object.fromEntries(
    keys.map((key) => [key, '']),
  ) as Record<Key, string>;
  const [values, setValues] = useState<Record<Key, string>>(emptyValues);

  function update(key: Key, value: string): void {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function clear(): void {
    setValues(emptyValues());
  }

  return { values, update, clear };
}

export function matchesStudentRecordFilter(
  value: string | number | null | undefined,
  filter: string,
): boolean {
  if (!filter) return true;

  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .includes(
      filter
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR'),
    );
}

export default function StudentRecordFilters<Key extends string>({
  idPrefix,
  label,
  fields,
  values,
  onChange,
  onClear,
}: {
  idPrefix: string;
  label: string;
  fields: ReadonlyArray<StudentRecordFilterField & { name: Key }>;
  values: Record<Key, string>;
  onChange: (key: Key, value: string) => void;
  onClear: () => void;
}): React.JSX.Element {
  const hasActiveFilter = Object.values(values).some(Boolean);

  return (
    <FormLayout
      className="studentsPage__recordFilters"
      aria-label={label}
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="studentsPage__recordFilterGrid">
        {fields.map((field) => {
          const id = `${idPrefix}-${field.name}`;

          return (
            <FormField key={field.name} id={id} label={field.label}>
              {field.options ? (
                <SelectField
                  key={field.options.map((option) => option.value).join('|')}
                  id={id}
                  name={field.name}
                  label={field.label}
                  value={values[field.name]}
                  placeholder={field.placeholder ?? `${field.label} (Todos)`}
                  options={field.options}
                  onChange={(event) => onChange(field.name, event.target.value)}
                />
              ) : (
                <TextInput
                  id={id}
                  name={field.name}
                  value={values[field.name]}
                  placeholder={field.placeholder ?? `${field.label}...`}
                  onChange={(event) => onChange(field.name, event.target.value)}
                />
              )}
            </FormField>
          );
        })}
        <TableListFilterActions>
          <TableListClearButton
            disabled={!hasActiveFilter}
            onClick={onClear}
          />
        </TableListFilterActions>
      </div>
    </FormLayout>
  );
}

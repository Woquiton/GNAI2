import { useRef, useState } from 'react';

/**
 * Linhas de alunos participantes: chaves estáveis por linha (a posição continua definindo
 * `student_ids.N`) e as alterações da lista, entregues a `onChange`.
 */
export function useStudentRows(studentIds: string[], onChange: (studentIds: string[]) => void) {
    const nextKey = useRef(studentIds.length);
    const [rowKeys, setRowKeys] = useState<number[]>(() => studentIds.map((_, index) => index));

    function change(index: number, value: string): void {
        onChange(studentIds.map((id, position) => (position === index ? value : id)));
    }

    function add(): void {
        const key = nextKey.current;
        nextKey.current += 1;
        setRowKeys((keys) => [...keys, key]);
        onChange([...studentIds, '']);
    }

    function remove(index: number): void {
        if (studentIds.length <= 1) {
            return;
        }

        setRowKeys((keys) => keys.filter((_, position) => position !== index));
        onChange(studentIds.filter((_, position) => position !== index));
    }

    /** Mantém só as primeiras linhas, como ao trocar para um atendimento individual. */
    function truncate(count: number): void {
        setRowKeys((keys) => keys.slice(0, count));
        onChange(studentIds.slice(0, count));
    }

    return { rowKeys, change, add, remove, truncate };
}

export type StudentRowsState = ReturnType<typeof useStudentRows>;

/** Campo lido pelo middleware `ExpandJsonPayload` do Laravel. */
export const JSON_PAYLOAD_FIELD = '_payload';

type Plain = Record<string, unknown>;

function isPlainObject(value: unknown): value is Plain {
    return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Separa os arquivos do restante dos dados. Os dados mantêm `null` no lugar de cada arquivo;
 * os arquivos ficam num objeto esparso com o mesmo caminho (`sections[2][image]`), para o
 * servidor devolvê-los às mesmas posições.
 */
function splitFiles(value: unknown): { data: unknown; files: unknown } {
    if (value instanceof Blob) {
        return { data: null, files: value };
    }

    if (Array.isArray(value) || isPlainObject(value)) {
        const entries = Array.isArray(value)
            ? value.map((item, index) => [String(index), item] as const)
            : Object.entries(value);
        const data: Plain | unknown[] = Array.isArray(value) ? [] : {};
        const files: Plain = {};

        for (const [key, item] of entries) {
            const split = splitFiles(item);
            (data as Plain)[key] = split.data;
            if (split.files !== undefined) files[key] = split.files;
        }

        return { data, files: Object.keys(files).length ? files : undefined };
    }

    return { data: value, files: undefined };
}

/**
 * Envio de formulários grandes: tudo vai em um único campo JSON e só os arquivos seguem como
 * campos multipart. Evita o limite `max_input_vars` do PHP, que descartaria o fim do envio.
 */
export function toJsonPayload(payload: Record<string, unknown>): Record<string, unknown> {
    const { data, files } = splitFiles(payload);

    return { ...((files as Plain | undefined) ?? {}), [JSON_PAYLOAD_FIELD]: JSON.stringify(data) };
}

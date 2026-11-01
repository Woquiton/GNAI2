import { aeeBase } from "@/components/Students/Students.utils";
import type { PaeeOption } from "./Paees.types";

export const paeesBase = `${aeeBase}/paees`;
export const paeeUrl = (id: number, action = "visualizar"): string =>
    `${paeesBase}/${id}${action ? `/${action}` : ""}`;
export const studentPaeesUrl = (studentId: number): string =>
    `${aeeBase}/alunos/${studentId}/paees`;
export const caseStudyUrl = (id: number): string =>
    `${aeeBase}/estudos-de-caso/${id}/visualizar`;

/** Aba do prontuário do aluno que reúne os PAEEs. */
export const studentPaeesTab = "paees";

export const statusOptions: PaeeOption[] = [
    { value: "active", label: "Ativo" },
    { value: "under_review", label: "Em revisão" },
    { value: "draft", label: "Rascunho" },
];

export const attendanceFormatOptions: PaeeOption[] = [
    { value: "individual", label: "Individual" },
    { value: "collective", label: "Coletivo" },
    { value: "mixed", label: "Misto" },
];

export const attendanceLocationOptions: PaeeOption[] = [
    { value: "srm", label: "Sala de Recursos Multifuncionais" },
    { value: "common_classroom", label: "Sala comum" },
    { value: "accessibility_center", label: "Núcleo de acessibilidade" },
    { value: "other", label: "Outro" },
];

export const objectiveTermOptions: PaeeOption[] = [
    { value: "short", label: "Curto" },
    { value: "medium", label: "Médio" },
    { value: "long", label: "Longo" },
];

export const acquisitionTypeOptions: PaeeOption[] = [
    { value: "to_produce", label: "A produzir" },
    { value: "to_accessibilize", label: "A acessibilizar" },
    { value: "to_acquire", label: "A adquirir" },
];

export function paeeStatusTone(status: string | null): string {
    if (status === "active") return "success";
    if (status === "under_review") return "warning";

    return "inverse";
}

export function paeeVersionLabel(version: number | null): string {
    return `v${version ?? "N/A"}`;
}

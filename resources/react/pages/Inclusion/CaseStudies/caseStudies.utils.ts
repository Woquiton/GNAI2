import { aeeBase } from "@/components/Students/Students.utils";
import { notify } from "@/components/UI/NotificationToast/notify";

export const caseStudiesBase = `${aeeBase}/estudos-de-caso`;
/** Aba do prontuário do aluno que reúne os Estudos de Caso. */
export const caseStudiesTab = "case-studies";

export const caseStudyUrl = (id: number, action = "visualizar"): string =>
    `${caseStudiesBase}/${id}${action ? `/${action}` : ""}`;
export const studentCaseStudiesUrl = (studentId: number): string =>
    `${aeeBase}/alunos/${studentId}/estudos-de-caso`;
export const createCaseStudyUrl = (studentId: number): string =>
    `${caseStudiesBase}/${studentId}/criar`;
export const createPaeeUrl = (caseStudyId: number): string =>
    `${aeeBase}/paees/${caseStudyId}/criar`;

export function caseStudyName(caseStudy: { version: number; student?: { name: string } | null }): string {
    const owner = caseStudy.student?.name;

    return `Estudo de Caso v${caseStudy.version}${owner ? ` de ${owner}` : ""}`;
}

/** Falhas de conexão e de resposta HTTP das requisições de formulário, no toast compartilhado. */
export function requestFailureHandlers(failureText: string): {
    onNetworkError: () => false;
    onHttpException: () => false;
} {
    return {
        onNetworkError: () => {
            notify({
                tone: "error",
                title: "Falha de conexão",
                text: "Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.",
            });
            return false;
        },
        onHttpException: () => {
            notify({
                tone: "error",
                title: "Não foi possível concluir",
                text: failureText,
            });
            return false;
        },
    };
}

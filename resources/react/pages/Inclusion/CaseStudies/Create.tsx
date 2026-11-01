import CaseStudyForm from "./CaseStudyForm";
import type { CaseStudyFormProps } from "./CaseStudies.types";

export default function InclusionCaseStudiesCreatePage(
    props: CaseStudyFormProps,
): React.JSX.Element {
    return <CaseStudyForm {...props} caseStudy={null} />;
}

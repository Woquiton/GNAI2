import CaseStudyForm from "./CaseStudyForm";
import type { CaseStudyFormProps } from "./CaseStudies.types";

export default function InclusionCaseStudiesEditPage(
    props: CaseStudyFormProps,
): React.JSX.Element {
    return (
        <CaseStudyForm
            key={props.caseStudy?.id}
            {...props}
        />
    );
}

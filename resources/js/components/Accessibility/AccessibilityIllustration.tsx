/** Exemplo decorativo da interface; as instruções equivalentes ficam no texto ao lado. */
export default function AccessibilityIllustration(): React.JSX.Element {
    return (
        <div className="accessibilityGuide__illustration" aria-hidden="true">
            <div className="accessibilityGuide__window">
                <div className="accessibilityGuide__windowBar">
                    <span /><span /><span />
                    <i className="fa fa-adjust" />
                </div>
                <div className="accessibilityGuide__windowBody">
                    <div className="accessibilityGuide__windowMenu">
                        <i className="fa fa-home" />
                        <i className="fa fa-user" />
                        <i className="fa fa-book" />
                    </div>
                    <div className="accessibilityGuide__windowContent">
                        <span className="accessibilityGuide__sampleTitle">Aa</span>
                        <span className="accessibilityGuide__sampleLine" />
                        <span className="accessibilityGuide__sampleLine accessibilityGuide__sampleLine--short" />
                        <div className="accessibilityGuide__sampleTiles">
                            <span><i className="fa fa-adjust" /></span>
                            <span><i className="fa fa-text-height" /></span>
                            <span><i className="fa fa-keyboard-o" /></span>
                        </div>
                    </div>
                </div>
            </div>
            <span className="accessibilityGuide__floatingKey">Tab <i className="fa fa-long-arrow-right" /></span>
            <span className="accessibilityGuide__floatingCheck"><i className="fa fa-check" /></span>
        </div>
    );
}

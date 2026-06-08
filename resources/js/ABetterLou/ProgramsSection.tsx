const CDN = 'https://cdn.prod.website-files.com/6939a31d6f0751cc94b4a574';
const ARROW = `${CDN}/6951317f9e7c4fc62f2c0c81_arrow.svg`;

const PLUMBING_ITEMS = [
    'Emergency plumbing repairs — fast response',
    'Leak detection and repair',
    'Bathroom and en-suite installation',
    'Kitchen plumbing and full re-plumbs',
    'Central heating, radiators, and pipe work',
    'Drainage unblocking and outdoor taps',
    'Water pressure diagnosis and repair',
];

const GAS_ELEC_ITEMS = [
    'New boiler installation and replacement',
    'Annual boiler servicing and fault finding',
    'Landlord gas safety certificates (CP12)',
    'Gas leak detection — emergency call-out',
    'Full and partial electrical rewires',
    'Consumer unit (fuse board) upgrades',
    'Electrical Installation Condition Reports (EICR)',
    'EV charger installation and security lighting',
];

function Circle({ light = false }: { light?: boolean }) {
    return (
        <div className={`circle_general${light ? ' circle_light' : ''}`}>
            <div className="arrow_general"><img src={ARROW} loading="lazy" alt="" className="image" /></div>
            <div className="abs_arrow"><img src={ARROW} loading="lazy" alt="" className="image" /></div>
        </div>
    );
}

type ProgramsSectionProps = {
    onGetQuote: () => void;
};

export default function ProgramsSection({ onGetQuote }: ProgramsSectionProps) {
    return (
        <section className="programs_section">
            <div className="wrapper_general">
                <div className="sides_plans">
                    {/* Plumbing — dark brown card */}
                    <div className="plan_brown">
                        <div className="header_plan">
                            <div className="plan_tag">Plumbing Services</div>
                            <div className="plan_headline h2">Reliable plumbing — domestic &amp; commercial.</div>
                        </div>
                        <div className="plan_body">
                            <div className="plan_desc base_p">
                                From a dripping tap to a full bathroom installation — our qualified plumbers handle every job with care and precision. Available for emergency call-outs 24/7.
                            </div>
                            <div className="abl-btn-row plan_cta">
                                <button
                                    type="button"
                                    onClick={onGetQuote}
                                    className="button general plan_btn_light"
                                    style={{ cursor: 'pointer', border: 'none' }}
                                >
                                    <div className="buble_button">Get a Free Quote</div>
                                    <Circle light />
                                </button>
                                <a href="tel:07865435946" className="button general plan_btn_light">
                                    <div className="buble_button">Call 07865 435 946</div>
                                </a>
                            </div>
                            <div className="plan_includes">
                                <div className="includes_label">What We Cover</div>
                                <div className="plan_list">
                                    {PLUMBING_ITEMS.map(item => (
                                        <div key={item} className="li_plan">
                                            <div className="dot_small" />
                                            <div className="base_p spec_line">{item}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="plan_badge base_p">Fully insured. Fixed prices.</div>
                        </div>
                    </div>

                    {/* Gas & Electrical — beige card */}
                    <div className="plan_primary">
                        <div className="header_plan">
                            <div className="plan_tag plan_tag_dark">Gas &amp; Electrical</div>
                            <div className="plan_headline plan_headline_dark h2">Registered engineers. Certified work.</div>
                        </div>
                        <div className="plan_body">
                            <div className="plan_desc plan_desc_dark base_p">
                                Gas Safe registered and NICEIC approved — we carry out all gas and electrical work to the highest safety standards with full certification on completion.
                            </div>
                            <div className="abl-btn-row plan_cta">
                                <button
                                    type="button"
                                    onClick={onGetQuote}
                                    className="button general"
                                    style={{ cursor: 'pointer', border: 'none' }}
                                >
                                    <div className="buble_button">Get a Free Quote</div>
                                    <Circle />
                                </button>
                                <a href="tel:07865435946" className="button general">
                                    <div className="buble_button">Call 07865 435 946</div>
                                </a>
                            </div>
                            <div className="plan_includes">
                                <div className="includes_label includes_label_dark">What We Cover</div>
                                <div className="plan_list">
                                    {GAS_ELEC_ITEMS.map(item => (
                                        <div key={item} className="li_plan li_plan_dark">
                                            <div className="dot_small dot_dark" />
                                            <div className="base_p spec_line plan_li_dark">{item}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

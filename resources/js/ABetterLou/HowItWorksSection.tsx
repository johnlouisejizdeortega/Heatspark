const CDN = 'https://cdn.prod.website-files.com/6939a31d6f0751cc94b4a574';
const ARROW = `${CDN}/6951317f9e7c4fc62f2c0c81_arrow.svg`;

const STEPS = [
    {
        number: 1,
        headline: 'Request a free quote',
        bullets: [
            'Call 07865 435 946 or fill in our contact form',
            'Tell us about the job — any detail helps us quote accurately',
            'We get back to you quickly with a fair, fixed price',
        ],
    },
    {
        number: 2,
        headline: 'Site visit & assessment',
        bullets: [
            'An engineer visits at a time that suits you',
            'We assess the job properly before any work begins',
            'Clear explanation of what needs doing and why',
        ],
    },
    {
        number: 3,
        headline: 'Work completed to standard',
        bullets: [
            'Qualified engineers complete the work efficiently',
            'All work carried out to current safety standards and regulations',
            'Site left clean, tidy, and fully tested',
        ],
    },
    {
        number: 4,
        headline: 'Certification & aftercare',
        bullets: [
            'Gas safety certificates, EICRs, and completion docs issued',
            'Warranties registered and paperwork provided',
            'We\'re here if you need us after the job is done',
        ],
    },
];

type HowItWorksSectionProps = {
    onGetQuote: () => void;
};

export default function HowItWorksSection({ onGetQuote }: HowItWorksSectionProps) {
    return (
        <section className="how_it_works">
            <div className="wrapper_general">
                <div className="progress_timeline">
                    {/* Left: sticky heading + CTA */}
                    <div className="headline_progress">
                        <div className="sticky_progress">
                            <div className="progress_heading">
                                <div className="section_tag">Our Process</div>
                                <h2 className="h2 brown">
                                    How we get
                                    <br />the job <span className="highlight">done</span>
                                </h2>
                            </div>
                            <div className="progress_desc">
                                <div className="base_p brown">
                                    A straightforward process built around clear communication and quality workmanship — from first contact to final certificate.
                                </div>
                            </div>
                            <div className="abl-btn-row">
                                <button
                                    type="button"
                                    onClick={onGetQuote}
                                    className="button general"
                                    style={{ background: '#1a1a1a', color: '#ffffff', cursor: 'pointer', border: 'none' }}
                                >
                                    <div className="buble_button">Get a Free Quote</div>
                                    <div className="circle_general" style={{ background: '#ffffff' }}>
                                        <div className="arrow_general">
                                            <img src={ARROW} loading="lazy" alt="" className="image" />
                                        </div>
                                        <div className="abs_arrow">
                                            <img src={ARROW} loading="lazy" alt="" className="image" />
                                        </div>
                                    </div>
                                </button>
                                <a
                                    href="tel:07865435946"
                                    className="button general"
                                    style={{ background: '#1a1a1a', color: '#ffffff' }}
                                >
                                    <div className="buble_button">Call 07865 435 946</div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right: timeline steps */}
                    <div className="timeline_progress">
                        <div className="line_progress" />
                        <div className="side_info">
                            <div className="headling_how">
                                <h2 className="h2 small">How it works</h2>
                            </div>
                            <ul className="points_list" role="list">
                                {STEPS.map(step => (
                                    <li key={step.number} className="item_point" role="listitem">
                                        <div className="number_step">{step.number}</div>
                                        <div className="point_heading">
                                            <span className="point_headline">{step.headline}</span>
                                            <div className="list_point">
                                                {step.bullets.map((b, i) => (
                                                    <div
                                                        key={i}
                                                        className={`li_step${i === step.bullets.length - 1 ? ' last' : ''}`}
                                                    >
                                                        {b}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const CDN = 'https://cdn.prod.website-files.com/6939a31d6f0751cc94b4a574';
const ARROW = `${CDN}/6951317f9e7c4fc62f2c0c81_arrow.svg`;

const DATA_ITEMS = [
    {
        number: 1,
        desc: 'Full domestic and commercial plumbing — carried out by qualified engineers.',
        bullets: [
            'Emergency repairs and leak detection',
            'Bathroom and kitchen installations',
            'Central heating, radiators, and pipe work',
            'Drainage and water pressure problems',
        ],
    },
    {
        number: 2,
        desc: 'Gas Safe registered engineers for all gas appliance and boiler work.',
        bullets: [
            'New boiler installations and replacements',
            'Annual boiler servicing and fault finding',
            'Landlord gas safety certificates (CP12)',
            'Gas leak detection and emergency call-out',
        ],
    },
    {
        number: 3,
        desc: 'NICEIC approved electricians delivering safe, certified electrical work.',
        bullets: [
            'Full and partial rewires',
            'Consumer unit upgrades and EICRs',
            'EV charger installation',
            'Fault finding, smoke alarms, and emergency call-out',
        ],
    },
];

type MetabolicSectionProps = {
    onGetQuote: () => void;
};

export default function MetabolicSection({ onGetQuote }: MetabolicSectionProps) {
    return (
        <section className="data_section">
            <div className="wrapper_general">
                <div className="metabolic_grid">
                    {/* Left: numbered service items */}
                    <div className="list_core">
                        <div className="core_label">Our Services</div>
                        {DATA_ITEMS.map(item => (
                            <div key={item.number} className="core_item">
                                <div className="core_number">0{item.number}</div>
                                <div className="core_content">
                                    <div className="core_desc base_p">{item.desc}</div>
                                    <div className="core_bullets">
                                        {item.bullets.map(b => (
                                            <div key={b} className="li_core">
                                                <div className="dot_small" />
                                                <div className="base_p spec_line">{b}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: sticky heading + description */}
                    <div className="metabolic_right">
                        <div className="metabolic_tag">Heat Spark Expertise</div>
                        <h2 className="h2">
                            Everything under one roof — <span className="highlight">plumbing, gas &amp; electrical</span>
                        </h2>
                        <div className="health_detail">Your property, our expertise</div>
                        <div className="metabolic_desc">
                            <div className="base_p">
                                One trusted company for all your trade needs. No juggling multiple contractors — Heat Spark covers plumbing, gas and electrical for homes and businesses, all under one roof.
                            </div>
                        </div>
                        <div className="abl-btn-row">
                            <button
                                type="button"
                                onClick={onGetQuote}
                                className="button general"
                                style={{ cursor: 'pointer', border: 'none' }}
                            >
                                <div className="buble_button">Get a Free Quote</div>
                                <div className="circle_general">
                                    <div className="arrow_general"><img src={ARROW} loading="lazy" alt="" className="image" /></div>
                                    <div className="abs_arrow"><img src={ARROW} loading="lazy" alt="" className="image" /></div>
                                </div>
                            </button>
                            <a href="tel:07865435946" className="button general">
                                <div className="buble_button">Call 07865 435 946</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

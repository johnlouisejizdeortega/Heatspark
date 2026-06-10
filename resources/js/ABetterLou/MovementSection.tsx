const CDN = 'https://cdn.prod.website-files.com/6939a31d6f0751cc94b4a574';
const ARROW = `${CDN}/6951317f9e7c4fc62f2c0c81_arrow.svg`;
// TODO: replace with real engineer/team photo

const BULLETS = [
    'All gas engineers Gas Safe registered — legally compliant on every job',
    'Electricians NICEIC approved — fully certified and insured work',
    'Comprehensive risk assessments, clean work sites, and full documentation',
];

type MovementSectionProps = {
    onGetQuote: () => void;
};

export default function MovementSection({ onGetQuote }: MovementSectionProps) {
    return (
        <section className="sides">
            <div className="left">
                <div className="wrapper_side">
                    <div className="heading_side">
                        <h2 className="h2 biege specific_home">
                            <span className="highlight">Quality</span> is your
                            <br />guarantee
                        </h2>

                        <div className="ch_p">
                            <div className="base_p">
                                At Heat Spark, quality is the foundation — not a promise we make but one we keep. Our engineers bring years of hands-on experience, up-to-date training, and a commitment to doing every job properly the first time.
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
                                    <div className="arrow_general">
                                        <img src={ARROW} loading="lazy" alt="" className="image" />
                                    </div>
                                    <div className="abs_arrow">
                                        <img src={ARROW} loading="lazy" alt="" className="image" />
                                    </div>
                                </div>
                            </button>
                            <a href="tel:07865435946" className="button general">
                                <div className="buble_button">Call 07865 435 946</div>
                            </a>
                        </div>
                    </div>

                    <div className="bottom_list_side">
                        {BULLETS.map(b => (
                            <div key={b} className="li_hero">
                                <div className="dot_small" />
                                <div className="base_p spec_line">{b}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="right">
                {/* TODO: replace with real engineer photo */}
                <div
                    className="image"
                    style={{ width: '100%', height: '100%', minHeight: '480px', background: 'var(--abl-brown-dark, #3d2010)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--abl-accent, #ffb442)', fontFamily: 'var(--abl-font-heading)', fontSize: '1rem', textAlign: 'center' }}
                >
                    [Engineer / team photo]
                </div>
            </div>
        </section>
    );
}

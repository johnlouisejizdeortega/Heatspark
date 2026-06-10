const CDN = 'https://cdn.prod.website-files.com/6939a31d6f0751cc94b4a574';
const ARROW = `${CDN}/6951317f9e7c4fc62f2c0c81_arrow.svg`;

const ICON_GAS  = `${CDN}/69513464dfe460db80641edd_icon-1.png`;
const ICON_CERT = `${CDN}/69513464a9e2df94324a1a7a_icon-2.png`;
const ICON_CALL = `${CDN}/69513464d6b94872f95059f7_icon-3.png`;

const TRUST_ITEMS = [
    { icon: ICON_GAS,  alt: 'Gas Safe icon', title: 'Gas Safe Registered', desc: 'All gas engineers registered and compliant.' },
    { icon: ICON_CERT, alt: 'NICEIC icon',   title: 'NICEIC Approved',     desc: 'Certified electricians on every job.' },
    { icon: ICON_CALL, alt: 'Emergency icon', title: '24/7 Emergency',     desc: 'Emergency call-out available around the clock.' },
];

type HeroSectionProps = {
    onGetQuote: () => void;
};

export default function HeroSection({ onGetQuote }: HeroSectionProps) {
    return (
        <main className="hero" data-section="hero">
            <div className="wrapper_hero">
                <div className="heading_hero">
                    <h1 className="h1">
                        Expert Plumbing, Gas<br />&amp; Electrical Services
                    </h1>

                    <div className="ch_box_hero">
                        <div className="base_paragraph">
                            Trusted domestic and commercial engineers. Gas Safe registered, NICEIC approved, and available 24/7 for emergencies — we fix it right the first time.
                        </div>
                    </div>

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

                    <a href="tel:07865435946" className="button general" style={{ marginLeft: '0.75rem' }}>
                        <div className="buble_button">Call 07865 435 946</div>
                    </a>
                </div>

                <div className="heading_bottom">
                    <div className="heading_bottom_txt">Built on trust.&nbsp; Focused on quality.</div>
                </div>

                <div className="bottom_side">
                    {TRUST_ITEMS.map((item, i) => (
                        <div key={item.title} className={`box_side${i === 2 ? ' last' : ''}`}>
                            <div className="circle_icon">
                                <img src={item.icon} loading="lazy" alt={item.alt} className="image" />
                            </div>
                            <div className="box_hero">
                                <div className="heading_box">{item.title}</div>
                                <div className="paragraph_box">{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="background_hero">
                <div className="overlay" />
                {/* TODO: replace with real hero images */}
                <div
                    className="image large_mobile"
                    style={{ background: 'linear-gradient(135deg, #1a0d00 0%, #3d2010 100%)', color: 'var(--abl-accent)', fontFamily: 'var(--abl-font-heading)', fontSize: '0.9rem', textAlign: 'center', paddingTop: '45%' }}
                >
                    [Hero image — mobile]
                </div>
                <div
                    className="image desktop"
                    style={{ background: 'linear-gradient(135deg, #1a0d00 0%, #3d2010 60%, #271500 100%)', color: 'var(--abl-accent)', fontFamily: 'var(--abl-font-heading)', fontSize: '1.1rem', textAlign: 'center', paddingTop: '40%' }}
                >
                    [Hero image — desktop]
                </div>
            </div>
        </main>
    );
}

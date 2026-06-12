const CDN = 'https://cdn.prod.website-files.com/6939a31d6f0751cc94b4a574';

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
                        Expert <span className="highlight">Plumbing, Gas<br />&amp; Electrical</span> Services
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
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                >
                    <source src="https://res.cloudinary.com/dqw9fo2w1/video/upload/v1781260911/14077529_4096_2160_30fps_ipurs6.mp4" type="video/mp4" />
                </video>
            </div>
        </main>
    );
}

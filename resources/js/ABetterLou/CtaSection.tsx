const CDN = 'https://cdn.prod.website-files.com/6939a31d6f0751cc94b4a574';
const ARROW = `${CDN}/6951317f9e7c4fc62f2c0c81_arrow.svg`;
// TODO: replace with real CTA background photo

type CtaSectionProps = {
    onGetQuote: () => void;
};

export default function CtaSection({ onGetQuote }: CtaSectionProps) {
    return (
        <section className="cta_section">
            <div className="cta_bg">
                {/* TODO: replace with real CTA background photo */}
                <div
                    className="image cta_bg_img"
                    style={{ background: 'linear-gradient(135deg, #1a0900 0%, #3d1a08 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(240,221,192,0.25)', fontFamily: 'var(--abl-font-heading)', fontSize: '0.9rem' }}
                >
                    [CTA background photo]
                </div>
                <div className="cta_overlay" />
            </div>
            <div className="wrapper_general">
                <div className="cta_content">
                    <div className="cta_tag">Available 24/7</div>
                    <h2 className="h2 cta_heading">
                        Emergency plumbing, gas &amp; electrical — we're there when you need us.
                    </h2>
                    <div className="base_p cta_desc">
                        A burst pipe, a gas leak, or a total power failure won't wait. Our engineers are on call around the clock for genuine emergencies — call us now and we'll be on our way.
                    </div>
                    <div className="abl-btn-row cta_actions">
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
        </section>
    );
}

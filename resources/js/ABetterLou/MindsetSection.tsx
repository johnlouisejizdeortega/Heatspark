const CDN = 'https://cdn.prod.website-files.com/6939a31d6f0751cc94b4a574';
const ARROW = `${CDN}/6951317f9e7c4fc62f2c0c81_arrow.svg`;
// TODO: replace with real fullscreen background photo

type MindsetSectionProps = {
    onGetQuote: () => void;
};

export default function MindsetSection({ onGetQuote }: MindsetSectionProps) {
    return (
        <>
            {/* Fullscreen founder / mission section */}
            <section className="fs_section">
                <div className="fs_bg">
                    {/* TODO: replace with real fullscreen background photo */}
                    <div
                        className="image fs_bg_img"
                        style={{ background: 'linear-gradient(135deg, #1a0900 0%, #2e1508 50%, #1a0900 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(240,221,192,0.3)', fontFamily: 'var(--abl-font-heading)', fontSize: '1rem' }}
                    >
                        [Fullscreen background photo]
                    </div>
                    <div className="fs_overlay" />
                </div>

                <div className="above_fs">
                    <div className="fs_grid">
                        <div className="fs_left">
                            <h2 className="h2">
                                Safe, reliable work starts with the right people showing up with the right tools.
                            </h2>
                            <div className="fs_sep" />
                            <div className="fs_info">
                                <div className="fs_info_heading">The mission behind Heat Spark</div>
                                <div className="base_p">
                                    Our goal is simple: deliver genuinely excellent trade services at honest prices, every single time — for homeowners, landlords, and businesses.
                                </div>
                            </div>
                        </div>

                        <div className="fs_right">
                            <div className="gary_card">
                                <div
                                    className="image gary_photo_img"
                                    style={{
                                        background: 'var(--abl-brown-dark, #3d2010)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        fontFamily: 'var(--abl-font-heading)',
                                        fontWeight: 700,
                                        color: 'var(--abl-accent, #ffb442)',
                                        borderRadius: '50%',
                                        width: '80px',
                                        height: '80px',
                                    }}
                                >
                                    OD
                                </div>
                                <div className="gary_info">
                                    <div className="member_name">Owen Davies</div>
                                    <div className="member_desc">Director, Heat Spark Energy Services Ltd</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* One Goal CTA */}
            <section className="one_goal">
                <div className="wrapper_general one_goal_inner">
                    <h2 className="h2">One Goal. Outstanding Service.</h2>
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
                </div>
            </section>
        </>
    );
}

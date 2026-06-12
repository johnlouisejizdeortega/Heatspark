import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CDN = 'https://cdn.prod.website-files.com/6939a31d6f0751cc94b4a574';
const ARROW = `${CDN}/6951317f9e7c4fc62f2c0c81_arrow.svg`;

type MindsetSectionProps = {
    onGetQuote: () => void;
};

export default function MindsetSection({ onGetQuote }: MindsetSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const imgRef     = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const img     = imgRef.current;
        const section = sectionRef.current;
        if (!img || !section) return;

        // start slightly scaled so edges never show during drift
        gsap.set(img, { scale: 1.1, transformOrigin: 'center center' });

        // Ken Burns: slow scale + gentle drift, looping back and forth
        const kenBurns = gsap.to(img, {
            scale: 1.22,
            x: '3%',
            y: '2%',
            duration: 24,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });

        // Parallax: image drifts upward as user scrolls through section
        const parallax = gsap.to(img, {
            yPercent: -12,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
            },
        });

        return () => {
            kenBurns.kill();
            parallax.scrollTrigger?.kill();
        };
    }, []);

    return (
        <>
            {/* Fullscreen founder / mission section */}
            <section ref={sectionRef} className="fs_section">
                <div className="fs_bg">
                    <img
                        ref={imgRef}
                        src="https://res.cloudinary.com/dqw9fo2w1/image/upload/v1781262935/liquid-marbling-paint-texture-background-fluid-painting-abstract-texture-intensive-color-mix-wallpaper_1258-103744_khdau5.avif"
                        alt=""
                        className="image fs_bg_img"
                        loading="lazy"
                    />
                    <div className="fs_overlay" />
                </div>

                <div className="above_fs">
                    <div className="fs_grid">
                        <div className="fs_left">
                            <div className="section_tag">Our Mission</div>
                            <h2 className="h2">
                                Safe, reliable work starts with the <span className="highlight">right people</span> showing up with the right tools.
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
                                        background: 'var(--abl-brown-dark, #1a1a1a)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        fontFamily: 'var(--abl-font-heading)',
                                        fontWeight: 700,
                                        color: 'var(--abl-accent, #ff6a00)',
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
                    <h2 className="h2">One Goal. <span className="highlight">Outstanding Service.</span></h2>
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

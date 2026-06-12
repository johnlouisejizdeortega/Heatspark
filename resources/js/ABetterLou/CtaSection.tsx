import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CDN = 'https://cdn.prod.website-files.com/6939a31d6f0751cc94b4a574';
const ARROW = `${CDN}/6951317f9e7c4fc62f2c0c81_arrow.svg`;

type CtaSectionProps = {
    onGetQuote: () => void;
};

export default function CtaSection({ onGetQuote }: CtaSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const imgRef     = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const img     = imgRef.current;
        const section = sectionRef.current;
        if (!img || !section) return;

        gsap.set(img, { scale: 1.1, transformOrigin: 'center center' });

        // Ken Burns loop — different timing to MindsetSection so they feel independent
        const kenBurns = gsap.to(img, {
            scale: 1.22,
            x: '-3%',
            y: '2.5%',
            duration: 20,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
        });

        // Scroll parallax
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
        <section ref={sectionRef} className="cta_section">
            <div className="cta_bg">
                <img
                    ref={imgRef}
                    src="https://res.cloudinary.com/dqw9fo2w1/image/upload/v1781262935/dynamic-abstract-background_889227-31971_nam3ri.avif"
                    alt=""
                    className="image cta_bg_img"
                    loading="lazy"
                />
                <div className="cta_overlay" />
            </div>
            <div className="wrapper_general">
                <div className="cta_content">
                    <div className="cta_tag">Available 24/7</div>
                    <h2 className="h2 cta_heading">
                        Emergency plumbing, gas &amp; electrical — <span className="highlight">we're there when you need us.</span>
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

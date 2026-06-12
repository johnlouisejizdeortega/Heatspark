import { useEffect, useRef, useState } from 'react';

const TARGET_VAL  = 500;
const TOTAL_DOTS  = 36;
const LARGE_EVERY = 3;  // every 3rd dot is large
const RADIUS      = 130; // px — matches 300px container

function getDotPos(i: number): { left: number; top: number } {
    const angle    = (i / TOTAL_DOTS) * 2 * Math.PI - Math.PI / 2;
    const isLarge  = i % LARGE_EVERY === 0;
    const halfSize = isLarge ? 4 : 2;
    return {
        left: 150 + RADIUS * Math.cos(angle) - halfSize,
        top:  150 + RADIUS * Math.sin(angle) - halfSize,
    };
}

export default function ClockSection() {
    const [count, setCount]       = useState(0);
    const [animating, setAnimating] = useState(false);
    const sectionRef    = useRef<HTMLElement>(null);
    const animationRef  = useRef<number | null>(null);
    const startTimeRef  = useRef<number | null>(null);
    const hasAnimated   = useRef(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    setAnimating(true);
                }
            },
            { threshold: 0.3 },
        );
        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!animating) return;
        const DURATION = 2800;
        const tick = (now: number) => {
            if (!startTimeRef.current) startTimeRef.current = now;
            const elapsed = now - startTimeRef.current;
            const t       = Math.min(elapsed / DURATION, 1);
            const eased   = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            setCount(Math.round(eased * TARGET_VAL));
            if (t < 1) {
                animationRef.current = requestAnimationFrame(tick);
            } else {
                setAnimating(false);
            }
        };
        animationRef.current = requestAnimationFrame(tick);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [animating]);

    const progress    = count / TARGET_VAL;
    const activeDots  = Math.round(progress * TOTAL_DOTS);
    const hand1Deg    = progress * 360;       // hour hand  — 1 full rotation
    const hand2Deg    = progress * 3 * 360;   // minute hand — 3 full rotations

    return (
        <section ref={sectionRef} className="clock_section">
            <div className="wrapper_general clock">
                <div className="middle_heading">
                    <div className="section_tag">Track Record</div>
                    <h2 className="h2 biege">
                        <span className="highlight">500+ jobs</span> and counting
                    </h2>
                </div>

                <div className="clock-container">
                    <div className="clock-circle">
                        {Array.from({ length: TOTAL_DOTS }).map((_, i) => {
                            const isLarge = i % LARGE_EVERY === 0;
                            const { left, top } = getDotPos(i);
                            const active = i < activeDots;
                            return (
                                <div
                                    key={i}
                                    className={`clock-dot${isLarge ? ' large_dots' : ''}${active ? ' active' : ''}`}
                                    style={{ left, top }}
                                />
                            );
                        })}

                        <div
                            className="clock-hand hand-1"
                            style={{ transform: `rotate(${hand1Deg}deg)` }}
                        />
                        <div
                            className="clock-hand hand-2"
                            style={{ transform: `rotate(${hand2Deg}deg)` }}
                        />

                        <div className="clock-center-circle" />
                    </div>

                    <div className="clock-center">
                        <div className="age-number">
                            <div className="age_txt">{count}+</div>
                        </div>
                        <div className="age-label">
                            <div className="age_desc">Jobs completed</div>
                        </div>
                    </div>
                </div>

                <div className="caption_clock">
                    <div className="base_p">
                        Over a decade of trusted plumbing, gas and electrical work across domestic and commercial properties.
                    </div>
                </div>
            </div>
        </section>
    );
}

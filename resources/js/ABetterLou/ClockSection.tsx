import { useEffect, useRef, useState } from 'react';

const START_VAL  = 0;
const TARGET_VAL = 500;
const LARGE_DOTS = 12;
const SMALL_DOTS = 24;
const TOTAL_DOTS = LARGE_DOTS + SMALL_DOTS;

function getDotPosition(index: number, radius: number, cx: number, cy: number) {
    const angle = (index / TOTAL_DOTS) * 2 * Math.PI - Math.PI / 2;
    return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
    };
}

function getHandRotation(val: number, isMinuteHand: boolean): number {
    const progress = val / TARGET_VAL;
    const fullRotations = isMinuteHand ? 3 : 1;
    return progress * fullRotations * 360;
}

export default function ClockSection() {
    const [count, setCount] = useState(START_VAL);
    const [animating, setAnimating] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const hasAnimated = useRef(false);

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
            const t = Math.min(elapsed / DURATION, 1);
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            const currentVal = Math.round(eased * TARGET_VAL);
            setCount(currentVal);

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

    const progress = count / TARGET_VAL;
    const activeDots = Math.round(progress * TOTAL_DOTS);
    const hand1Rotation = getHandRotation(count, false);
    const hand2Rotation = getHandRotation(count, true);

    const cx = 150;
    const cy = 150;
    const dotRadius = 130;

    return (
        <section ref={sectionRef} className="clock_section">
            <div className="wrapper_general clock">
                <div className="middle_heading">
                    <h2 className="h2 biege">
                        <span className="highlight">500+ jobs</span> and counting
                    </h2>
                </div>

                <div className="clock-container">
                    <svg
                        viewBox="0 0 300 300"
                        width="300"
                        height="300"
                        style={{ position: 'absolute', inset: 0 }}
                        aria-hidden="true"
                    >
                        <circle cx={cx} cy={cy} r={148} fill="none" stroke="rgba(240,221,192,0.1)" strokeWidth="1.5" />

                        {Array.from({ length: TOTAL_DOTS }).map((_, i) => {
                            const isLarge = i % 3 === 0;
                            const { x, y } = getDotPosition(i, dotRadius, cx, cy);
                            const active = i < activeDots;
                            return (
                                <circle
                                    key={i}
                                    cx={x}
                                    cy={y}
                                    r={isLarge ? 4 : 2}
                                    fill={active ? '#FFD700' : 'rgba(240,221,192,0.22)'}
                                    style={{
                                        filter: active ? 'drop-shadow(0 0 4px rgba(255,215,0,0.6))' : 'none',
                                        transition: 'fill 0.4s, filter 0.4s',
                                    }}
                                />
                            );
                        })}

                        <line
                            x1={cx} y1={cy} x2={cx} y2={cy - 105}
                            stroke="rgba(240,221,192,0.55)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            transform={`rotate(${hand2Rotation}, ${cx}, ${cy})`}
                            style={{ transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)' }}
                        />
                        <line
                            x1={cx} y1={cy} x2={cx} y2={cy - 78}
                            stroke="rgba(240,221,192,1)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            transform={`rotate(${hand1Rotation}, ${cx}, ${cy})`}
                            style={{ transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)' }}
                        />
                        <circle cx={cx} cy={cy} r={5} fill="var(--abl-beige, #f0ddc0)" />
                    </svg>

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

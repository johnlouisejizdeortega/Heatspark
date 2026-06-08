import { useCallback, useState } from 'react';

const SERVICES = [
    {
        name: 'Plumbing',
        role: 'Emergency repairs, bathroom & kitchen fits',
        img: '/images/optimised/598845316_716187218209060_515352522120168966_n.webp',
    },
    {
        name: 'Boiler Installation',
        role: 'Worcester Bosch, Vaillant, and all leading brands',
        img: '/images/WorcesterBoschGreenstarBoiler.webp',
    },
    {
        name: 'Gas Services',
        role: 'Gas Safe engineers — CP12 certs, servicing & repairs',
        img: '/images/optimised/gas-boiler-vaillant-vmw-23cs-1-5-cf-ecotec-plus-removebg-preview.webp',
    },
    {
        name: 'Electrical',
        role: 'NICEIC approved — rewires, consumer units, EICRs',
        img: '/images/optimised/602356195_716187341542381_988282437403626983_n.webp',
    },
];

const SLIDE_WIDTH = 280 + 24;

function ServiceCard({ name, role, img }: (typeof SERVICES)[number]) {
    return (
        <div className="splide__slide">
            <div className="box_inside">
                <div className="video_overlay">
                    <div className="small_overlay" />
                    <img
                        src={img}
                        alt={name}
                        className="video preview_video"
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                </div>
                <div className="name_description">
                    <div className="member_name">{name}</div>
                    <div className="member_desc">{role}</div>
                </div>
            </div>
        </div>
    );
}

export default function TeamCarousel() {
    const [offset, setOffset] = useState(0);
    const maxOffset = (SERVICES.length - 1) * SLIDE_WIDTH;

    const prev = useCallback(() => setOffset(o => Math.max(0, o - SLIDE_WIDTH)), []);
    const next = useCallback(() => setOffset(o => Math.min(maxOffset, o + SLIDE_WIDTH)), [maxOffset]);

    return (
        <section className="carousel_interviews">
            <div className="heading_arrows">
                <div>
                    <h2 className="h2">What we do</h2>
                </div>
                <div className="carousel-controls">
                    <button type="button" className="carousel-btn" onClick={prev} aria-label="Previous" disabled={offset === 0}>
                        ←
                    </button>
                    <button type="button" className="carousel-btn" onClick={next} aria-label="Next" disabled={offset >= maxOffset}>
                        →
                    </button>
                </div>
            </div>

            <div className="slider_wrap specific_guided">
                <div className="container guided_by">
                    <div className="splide slider1">
                        <div className="splide__track">
                            <div
                                className="splide__list"
                                style={{ transform: `translateX(-${offset}px)` }}
                            >
                                {SERVICES.map(svc => (
                                    <ServiceCard key={svc.name} {...svc} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import '@/Heatspark/heatspark.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/roboto/400.css';
import Nav from '@/Heatspark/Nav';
import Footer from '@/Heatspark/Footer';
import ChatWidget from '@/Heatspark/ChatWidget';

const HERO_BG = '/images/optimised/tinywow_Gemini_Generated_Image_axglyxaxglyxaxgl_88102741.webp';
const ABOUT_IMG = '/images/optimised/598842520_716187328209049_5024487161616544655_n.webp';

const SERVICES = [
    {
        icon: '🔧',
        title: 'Plumbing',
        desc: 'Full domestic and commercial plumbing — emergency repairs, leak fixes, bathroom installations, pipe work and more.',
    },
    {
        icon: '🔥',
        title: 'Gas Services',
        desc: 'Gas Safe registered engineers. Boiler installations, servicing, repairs, landlord CP12 certificates and gas safety checks.',
    },
    {
        icon: '⚡',
        title: 'Electrical',
        desc: 'NICEIC approved electricians. Rewires, consumer unit upgrades, EICRs, fault finding, and commercial fit-outs.',
    },
];

function ArrowIcon() {
    return (
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default function Home() {
    return (
        <div className="hs-root">
            <Head title="Heat Spark Energy Services — Plumbing, Gas & Electrical">
                <meta name="description" content="Expert domestic and commercial plumbing, gas and electrical services. Gas Safe registered and NICEIC approved. Get a free quote today." />
                <meta property="og:title" content="Heat Spark Energy Services Ltd" />
                <meta property="og:description" content="Trusted plumbing, gas and electrical specialists for homes and businesses." />
                <meta property="og:type" content="website" />
                <meta name="robots" content="index,follow" />
                <link rel="canonical" href="https://heatsparkenergy.co.uk/" />
            </Head>

            <Nav />

            {/* ── HERO ── */}
            <section className="hs-hero">
                <div className="hs-hero-bg">
                    <img src={HERO_BG} alt="" role="presentation" loading="eager" />
                    <div className="hs-hero-overlay" />
                </div>
                <div className="hs-wrap hs-hero-content">
                    <div className="hs-hero-badge">
                        <div className="hs-badge-dot" />
                        Gas Safe Registered · NICEIC Approved
                    </div>
                    <h1 className="hs-h1">
                        Plumbing, Gas &amp; <em>Electrical</em> You Can Rely On
                    </h1>
                    <p className="hs-hero-desc">
                        Trusted domestic and commercial engineers. We fix it right the first time — from emergency call-outs to full installations.
                    </p>
                    <div className="hs-btn-row">
                        <Link href="/contact" className="hs-pill">
                            <span>Get a Free Quote</span>
                            <span className="hs-pill-circle"><ArrowIcon /></span>
                        </Link>
                        <a href="tel:07865435946" className="hs-pill hs-pill-ghost">
                            📞 07865 435 946
                        </a>
                    </div>
                    <div className="hs-stats-row">
                        {[
                            { num: '500+', label: 'Jobs completed' },
                            { num: '10+',  label: 'Years experience' },
                            { num: '24/7', label: 'Emergency cover' },
                            { num: '★ 5',  label: 'Rated by customers' },
                        ].map(s => (
                            <div key={s.label} className="hs-stat">
                                <span className="hs-stat-num">{s.num}</span>
                                <span className="hs-stat-label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ABOUT ── */}
            <section className="hs-section" style={{ background: 'var(--hs-bg-raised)' }}>
                <div className="hs-wrap">
                    <div className="hs-feature-grid">
                        <img
                            src={ABOUT_IMG}
                            alt="Heat Spark engineer at work"
                            className="hs-feature-img"
                            loading="lazy"
                        />
                        <div className="hs-feature-content">
                            <div className="hs-tag">About Us</div>
                            <div className="hs-bar" />
                            <h2 className="hs-h2">Specialists in Plumbing, Gas &amp; Electrical</h2>
                            <p className="hs-lead">
                                Heat Spark Energy Services Ltd delivers expert domestic and commercial plumbing, gas and electrical work — safely and reliably.
                            </p>
                            <p className="hs-body">
                                Founded by Owen Davies, we bring years of hands-on trade experience and a commitment to quality. Whether it's a dripping tap, a full boiler replacement, or a complete electrical rewire — we get it done properly, on time.
                            </p>
                            <ul className="hs-check-list">
                                {[
                                    'Gas Safe Registered engineers',
                                    'NICEIC approved electricians',
                                    'Domestic & commercial work covered',
                                    '24/7 emergency call-out available',
                                    'Fully insured — all trades',
                                ].map(item => (
                                    <li key={item} className="hs-check-item">
                                        <div className="hs-check-dot" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="hs-btn-row" style={{ marginTop: '0.5rem' }}>
                                <Link href="/about" className="hs-pill">
                                    <span>Learn More</span>
                                    <span className="hs-pill-circle"><ArrowIcon /></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SERVICES PREVIEW ── */}
            <section className="hs-section hs-services-section">
                <div className="hs-wrap">
                    <div className="hs-section-header">
                        <div className="hs-tag">What We Do</div>
                        <div className="hs-bar" />
                        <h2 className="hs-h2">Our Services</h2>
                        <p className="hs-lead" style={{ marginTop: '0.75rem' }}>
                            From routine maintenance to full installations — covering homes and businesses.
                        </p>
                    </div>
                    <div className="hs-service-cards">
                        {SERVICES.map(s => (
                            <div key={s.title} className="hs-service-card">
                                <div className="hs-service-icon">{s.icon}</div>
                                <h3 className="hs-h3">{s.title}</h3>
                                <p>{s.desc}</p>
                                <Link href="/services" className="hs-service-card-link">
                                    View service →
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SOCIAL ── */}
            <section className="hs-social-strip">
                <div className="hs-wrap">
                    <div className="hs-social-inner">
                        <div className="hs-social-text">
                            <h3 className="hs-h3">Follow Our Work</h3>
                            <p>See recent jobs, before &amp; afters, and tips on our social channels.</p>
                        </div>
                        <div className="hs-social-btns">
                            <a href="https://www.facebook.com/HeatsparkenergY" target="_blank" rel="noopener noreferrer" className="hs-social-pill-btn">
                                📘 Facebook
                            </a>
                            <a href="https://wa.me/447865435946" target="_blank" rel="noopener noreferrer" className="hs-social-pill-btn">
                                💬 WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="hs-cta-banner">
                <div className="hs-wrap">
                    <div className="hs-cta-inner">
                        <div>
                            <h2 className="hs-h2">Ready to Get Started?</h2>
                            <p>Get in touch for a free, no-obligation quote on any job — big or small.</p>
                        </div>
                        <div className="hs-btn-row">
                            <Link href="/contact" className="hs-pill hs-pill-white">
                                <span>Request a Quote</span>
                                <span className="hs-pill-circle" style={{ background: 'rgba(255,106,0,0.15)' }}>
                                    <ArrowIcon />
                                </span>
                            </Link>
                            <a href="tel:07865435946" className="hs-pill hs-pill-dark">
                                📞 Call Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <ChatWidget />
        </div>
    );
}

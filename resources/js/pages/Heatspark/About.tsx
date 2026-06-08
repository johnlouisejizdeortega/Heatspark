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

const IMG1 = '/images/optimised/598842520_716187328209049_5024497161616544655_n.webp';
const IMG2 = '/images/optimised/598934951_716187244875724_5873043382233951837_n.webp';

const VALUES = [
    { title: 'Safety First', desc: 'Every job completed to the highest safety standards. Gas Safe registered and NICEIC approved — your safety is non-negotiable.' },
    { title: 'Reliable & On Time', desc: 'We respect your time. Engineers arrive when we say, and complete work within the agreed timeframe.' },
    { title: 'Transparent Pricing', desc: 'No hidden fees, no surprises. Clear quotes before work begins — and we stick to them.' },
    { title: 'Quality Workmanship', desc: 'From the smallest repair to a full installation, every job is done right. We take pride in our work.' },
];

const CERTS = [
    { icon: '🔥', name: 'Gas Safe', desc: 'Registered' },
    { icon: '⚡', name: 'NICEIC', desc: 'Approved' },
    { icon: '🛡️', name: 'Fully', desc: 'Insured' },
    { icon: '✅', name: '5-Star', desc: 'Rated' },
];

function ArrowIcon() {
    return (
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default function About() {
    return (
        <div className="hs-root">
            <Head title="About Us — Heat Spark Energy Services">
                <meta name="description" content="Learn about Heat Spark Energy Services Ltd — trusted domestic and commercial plumbing, gas and electrical specialists. Gas Safe registered and NICEIC approved." />
                <link rel="canonical" href="https://heatsparkenergy.co.uk/about" />
            </Head>

            <Nav />

            {/* Page Hero */}
            <section className="hs-page-hero">
                <div className="hs-wrap hs-page-hero-inner">
                    <div className="hs-breadcrumb">
                        <Link href="/">Home</Link>
                        <span> › </span>
                        <span>About Us</span>
                    </div>
                    <div className="hs-tag">Our Story</div>
                    <div className="hs-bar" />
                    <h1 className="hs-h1">About <em>Heat Spark</em></h1>
                    <p className="hs-lead" style={{ marginTop: '1rem', maxWidth: 600 }}>
                        Honest, reliable tradespeople committed to delivering quality plumbing, gas and electrical work for homes and businesses.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="hs-section" style={{ background: 'var(--hs-bg-raised)' }}>
                <div className="hs-wrap">
                    <div className="hs-feature-grid">
                        <div className="hs-feature-content">
                            <div className="hs-tag">Who We Are</div>
                            <div className="hs-bar" />
                            <h2 className="hs-h2">Built on Trust, <em>Driven by Quality</em></h2>
                            <p className="hs-lead">
                                Heat Spark Energy Services Ltd was founded by Owen Davies with one goal: genuinely excellent trade services at fair prices.
                            </p>
                            <p className="hs-body">
                                We work with homeowners, landlords, and businesses to solve plumbing, gas and electrical problems — big and small. Our team of qualified engineers brings years of hands-on experience and an unwavering commitment to doing the job properly.
                            </p>
                            <p className="hs-body">
                                Whether you need a leaking pipe fixed, a new boiler installed, or a full electrical rewire, we treat every property as if it were our own. Clean, tidy, high-quality work — every time.
                            </p>
                            <div className="hs-btn-row" style={{ marginTop: '0.5rem' }}>
                                <Link href="/contact" className="hs-pill">
                                    <span>Get in Touch</span>
                                    <span className="hs-pill-circle"><ArrowIcon /></span>
                                </Link>
                                <Link href="/services" className="hs-pill hs-pill-ghost">
                                    Our Services
                                </Link>
                            </div>
                        </div>
                        <img
                            src={IMG1}
                            alt="Heat Spark team"
                            className="hs-feature-img"
                            loading="lazy"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="hs-section hs-values-section">
                <div className="hs-wrap">
                    <div className="hs-section-header">
                        <div className="hs-tag">Our Principles</div>
                        <div className="hs-bar" />
                        <h2 className="hs-h2">Why Customers Choose Us</h2>
                    </div>
                    <div className="hs-values-grid">
                        {VALUES.map(v => (
                            <div key={v.title} className="hs-value-card">
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Second image section */}
            <section className="hs-section" style={{ background: 'var(--hs-bg-raised)' }}>
                <div className="hs-wrap">
                    <div className="hs-feature-grid">
                        <img
                            src={IMG2}
                            alt="Heat Spark engineer"
                            className="hs-feature-img"
                            loading="lazy"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="hs-feature-content">
                            <div className="hs-tag">Our Commitment</div>
                            <div className="hs-bar" />
                            <h2 className="hs-h2">Domestic &amp; <em>Commercial</em> Specialists</h2>
                            <p className="hs-lead">
                                From single-property repairs to multi-site commercial contracts — we handle it all.
                            </p>
                            <p className="hs-body">
                                Our engineers are fully qualified, regularly trained, and equipped for any job. We carry out thorough risk assessments, provide full documentation, and leave every site clean and safe.
                            </p>
                            <ul className="hs-check-list">
                                {[
                                    'Boiler servicing & landlord gas safety certs',
                                    'Full kitchen & bathroom re-plumbs',
                                    'Commercial electrical fit-outs',
                                    'EICR certificates for landlords & businesses',
                                    'Emergency call-out 24/7',
                                ].map(item => (
                                    <li key={item} className="hs-check-item">
                                        <div className="hs-check-dot" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="hs-btn-row" style={{ marginTop: '0.5rem' }}>
                                <Link href="/portfolio" className="hs-pill">
                                    <span>View Our Work</span>
                                    <span className="hs-pill-circle"><ArrowIcon /></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Certs */}
            <section className="hs-certs-bar">
                <div className="hs-wrap">
                    <div className="hs-certs-inner">
                        <div>
                            <div className="hs-tag">Accredited &amp; Certified</div>
                            <div className="hs-bar" />
                            <h2 className="hs-h2">You're in Safe Hands</h2>
                            <p className="hs-body" style={{ marginTop: '0.5rem' }}>All engineers fully qualified, registered, and accredited.</p>
                        </div>
                        <div className="hs-certs-badges">
                            {CERTS.map(c => (
                                <div key={c.name} className="hs-cert-badge">
                                    <div className="hs-cert-icon">{c.icon}</div>
                                    <div>
                                        <div className="hs-cert-name">{c.name}</div>
                                        <div className="hs-cert-desc">{c.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="hs-cta-banner">
                <div className="hs-wrap">
                    <div className="hs-cta-inner">
                        <div>
                            <h2 className="hs-h2">Ready to Work Together?</h2>
                            <p>Get a free, no-obligation quote on any job — big or small.</p>
                        </div>
                        <div className="hs-btn-row">
                            <Link href="/contact" className="hs-pill hs-pill-white">
                                <span>Get a Quote</span>
                                <span className="hs-pill-circle" style={{ background: 'rgba(255,106,0,0.15)' }}><ArrowIcon /></span>
                            </Link>
                            <a href="tel:07865435946" className="hs-pill hs-pill-dark">📞 Call Now</a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <ChatWidget />
        </div>
    );
}

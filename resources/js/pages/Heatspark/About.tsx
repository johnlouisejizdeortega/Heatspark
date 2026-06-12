import { useCallback, useState } from 'react';
import { Head } from '@inertiajs/react';
import '@/ABetterLou/abl.css';
import Nav from '@/ABetterLou/Nav';
import MobileMenu from '@/ABetterLou/MobileMenu';
import ReserveModal from '@/ABetterLou/ReserveModal';
import SiteFooter from '@/ABetterLou/SiteFooter';
import PlaceholderGraphic from '@/ABetterLou/PlaceholderGraphic';

const VALUES = [
    { title: 'Safety First', desc: 'Every job completed to the highest safety standards. Gas Safe registered and NICEIC approved — your safety is non-negotiable.' },
    { title: 'Reliable & On Time', desc: 'We respect your time. Engineers arrive when we say, and complete work within the agreed timeframe.' },
    { title: 'Transparent Pricing', desc: 'No hidden fees, no surprises. Clear quotes before work begins — and we stick to them.' },
    { title: 'Quality Workmanship', desc: 'From the smallest repair to a full installation, every job is done right. We take pride in our work.' },
];

const CHECKLIST = [
    'Boiler servicing & landlord gas safety certs',
    'Full kitchen & bathroom re-plumbs',
    'Commercial electrical fit-outs',
    'EICR certificates for landlords & businesses',
    'Emergency call-out 24/7',
];

const TAG: React.CSSProperties = { color: 'var(--abl-accent)', fontFamily: 'var(--abl-font-heading)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' };
const BTN_ROW: React.CSSProperties = { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' };
const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' };
const SECTION: React.CSSProperties = { padding: '6rem 0', background: 'var(--abl-bg)', borderTop: '1px solid rgba(255,255,255,0.06)' };

export default function About() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [modalOpen,  setModalOpen]  = useState(false);
    const openMobile  = useCallback(() => setMobileOpen(true),  []);
    const closeMobile = useCallback(() => setMobileOpen(false), []);
    const openModal   = useCallback(() => setModalOpen(true),   []);
    const closeModal  = useCallback(() => setModalOpen(false),  []);

    return (
        <div className="abl-root">
            <Head title="About Us — Heat Spark Energy Services">
                <meta name="description" content="Learn about Heat Spark Energy Services Ltd — trusted domestic and commercial plumbing, gas and electrical specialists. Gas Safe registered and NICEIC approved." />
                <link rel="canonical" href="https://heatsparkenergy.co.uk/about" />
            </Head>

            <Nav onMenuOpen={openMobile} onGetQuote={openModal} />
            <MobileMenu open={mobileOpen} onClose={closeMobile} />
            <ReserveModal open={modalOpen} onClose={closeModal} />

            {/* Page hero */}
            <section style={{ background: 'var(--abl-bg)', paddingTop: '8rem', paddingBottom: '5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="wrapper_general">
                    <div style={TAG}>Our Story</div>
                    <h1 className="h1" style={{ maxWidth: 700 }}>About <span className="highlight">Heat Spark</span></h1>
                    <p className="base_p" style={{ marginTop: '1.25rem', maxWidth: 580 }}>
                        Honest, reliable tradespeople committed to delivering quality plumbing, gas and electrical work for homes and businesses.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section style={SECTION}>
                <div className="wrapper_general">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <div style={TAG}>Who We Are</div>
                            <h2 className="h2 biege" style={{ marginBottom: '1.25rem' }}>Built on Trust, <span className="highlight">Driven by Quality</span></h2>
                            <p className="base_p" style={{ marginBottom: '1rem' }}>Heat Spark Energy Services Ltd was founded by Owen Davies with one goal: genuinely excellent trade services at fair prices.</p>
                            <p className="base_p" style={{ marginBottom: '1rem' }}>We work with homeowners, landlords, and businesses to solve plumbing, gas and electrical problems — big and small. Our engineers bring years of hands-on experience and an unwavering commitment to doing the job properly.</p>
                            <p className="base_p" style={{ marginBottom: '2rem' }}>Whether you need a leaking pipe fixed, a new boiler installed, or a full electrical rewire, we treat every property as if it were our own.</p>
                            <div style={BTN_ROW}>
                                <button type="button" onClick={openModal} className="button general" style={{ cursor: 'pointer', border: 'none' }}>
                                    <div className="buble_button">Get a Free Quote</div>
                                </button>
                                <a href="/services" className="button general">
                                    <div className="buble_button">Our Services</div>
                                </a>
                            </div>
                        </div>
                        <PlaceholderGraphic type="team" style={{ ...CARD, overflow: 'hidden', minHeight: 400 }} />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section style={SECTION}>
                <div className="wrapper_general">
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div style={TAG}>Our Principles</div>
                        <h2 className="h2 biege">Why Customers <span className="highlight">Choose Us</span></h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {VALUES.map(v => (
                            <div key={v.title} style={{ ...CARD, padding: '2rem' }}>
                                <h3 style={{ fontFamily: 'var(--abl-font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--abl-accent)', marginBottom: '0.75rem' }}>{v.title}</h3>
                                <p className="base_p">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Commitment */}
            <section style={SECTION}>
                <div className="wrapper_general">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <PlaceholderGraphic type="engineer" style={{ ...CARD, overflow: 'hidden', minHeight: 400 }} />
                        <div>
                            <div style={TAG}>Our Commitment</div>
                            <h2 className="h2 biege" style={{ marginBottom: '1.25rem' }}>Domestic &amp; <span className="highlight">Commercial</span> Specialists</h2>
                            <p className="base_p" style={{ marginBottom: '1.5rem' }}>From single-property repairs to multi-site commercial contracts. Our engineers are fully qualified, regularly trained, and equipped for any job.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                                {CHECKLIST.map(item => (
                                    <div key={item} className="li_hero">
                                        <div className="dot_small" />
                                        <div className="base_p spec_line">{item}</div>
                                    </div>
                                ))}
                            </div>
                            <a href="/portfolio" className="button general">
                                <div className="buble_button">View Our Work</div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Accreditations */}
            <section style={SECTION}>
                <div className="wrapper_general">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <div style={TAG}>Accredited & Certified</div>
                            <h2 className="h2 biege" style={{ marginBottom: '0.75rem' }}>You're in <span className="highlight">Safe Hands</span></h2>
                            <p className="base_p">All engineers fully qualified, registered, and accredited.</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {['Gas Safe Registered', 'NICEIC Approved', 'Fully Insured', '5-Star Rated'].map(cert => (
                                <div key={cert} style={{ ...CARD, borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
                                    <div style={{ fontFamily: 'var(--abl-font-heading)', fontWeight: 700, color: 'var(--abl-beige)', fontSize: '0.95rem' }}>{cert}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ ...SECTION, textAlign: 'center' }}>
                <div className="wrapper_general">
                    <h2 className="h2 biege" style={{ marginBottom: '0.75rem' }}>Ready to <span className="highlight">Work Together?</span></h2>
                    <p className="base_p" style={{ marginBottom: '2rem' }}>Get a free, no-obligation quote on any job — big or small.</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button type="button" onClick={openModal} className="button general" style={{ cursor: 'pointer', border: 'none' }}>
                            <div className="buble_button">Get a Free Quote</div>
                        </button>
                        <a href="tel:07865435946" className="button general">
                            <div className="buble_button">Call 07865 435 946</div>
                        </a>
                    </div>
                </div>
            </section>

            <SiteFooter />

            <a href="https://wa.me/447865435946" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
                style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.35)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
        </div>
    );
}

import { useCallback, useState } from 'react';
import { Head } from '@inertiajs/react';
import '@/ABetterLou/abl.css';
import Nav from '@/ABetterLou/Nav';
import MobileMenu from '@/ABetterLou/MobileMenu';
import ReserveModal from '@/ABetterLou/ReserveModal';
import SiteFooter from '@/ABetterLou/SiteFooter';
import PlaceholderGraphic, { type GraphicType } from '@/ABetterLou/PlaceholderGraphic';

const CAT_GRAPHIC: Record<string, GraphicType> = { Gas: 'gas', Plumbing: 'plumbing', Electrical: 'electrical' };

const PROJECTS = [
    { cat: 'Gas',        title: 'Worcester Bosch Greenstar Installation', desc: 'Full boiler replacement with a new Worcester Bosch Greenstar combi. Completed same day, no disruption to the household.' },
    { cat: 'Gas',        title: 'Vaillant EcoTec Combi Replacement',      desc: 'New Vaillant EcoTec Plus installed including full system flush and magnetic filter. 10-year warranty registered.' },
    { cat: 'Gas',        title: 'Logic System — Commercial Premises',     desc: 'Logic System boiler fitted for a commercial site. Full commissioning, gas safety check, and landlord certification.' },
    { cat: 'Plumbing',   title: 'Full Bathroom Re-Fit',                   desc: 'Complete bathroom strip-out and re-fit including new suite, tiling, and all associated plumbing for a residential property.' },
    { cat: 'Plumbing',   title: 'Central Heating System Upgrade',         desc: 'Full central heating upgrade including new radiators, pipework, and smart thermostat controls throughout a 4-bed house.' },
    { cat: 'Electrical', title: 'Consumer Unit Upgrade',                  desc: 'Full consumer unit replacement with new RCD-protected board, tested and certified to current BS7671 standards.' },
];

const TESTIMONIALS = [
    { text: 'Owen and the team sorted our bathroom from scratch — stripped it out and fitted a brand new suite. Immaculate finish. Absolutely delighted.', name: 'Mrs. Williams', role: 'Residential Customer' },
    { text: 'Heat Spark fitted a new boiler and serviced the whole heating system. Everything running perfectly. Professional from start to finish.', name: 'Mr. Thompson', role: 'Landlord' },
    { text: 'Had them rewire our kitchen and upgrade the consumer unit. Clean, tidy, no fuss. Great communication throughout. Would definitely use again.', name: 'Rachel P.', role: 'Homeowner' },
];

const TAG: React.CSSProperties = { color: 'var(--abl-accent)', fontFamily: 'var(--abl-font-heading)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' };
const SECTION: React.CSSProperties = { padding: '6rem 0', background: 'var(--abl-bg)', borderTop: '1px solid rgba(255,255,255,0.06)' };
const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' };

export default function Portfolio() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [modalOpen,  setModalOpen]  = useState(false);
    const openMobile  = useCallback(() => setMobileOpen(true),  []);
    const closeMobile = useCallback(() => setMobileOpen(false), []);
    const openModal   = useCallback(() => setModalOpen(true),   []);
    const closeModal  = useCallback(() => setModalOpen(false),  []);

    return (
        <div className="abl-root">
            <Head title="Portfolio — Our Work | Heat Spark Energy Services">
                <meta name="description" content="See examples of our plumbing, gas and electrical work. Boiler installations, bathroom fits, consumer units and more." />
                <link rel="canonical" href="https://heatsparkenergy.co.uk/portfolio" />
            </Head>

            <Nav onMenuOpen={openMobile} onGetQuote={openModal} />
            <MobileMenu open={mobileOpen} onClose={closeMobile} />
            <ReserveModal open={modalOpen} onClose={closeModal} />

            {/* Page hero */}
            <section style={{ background: 'var(--abl-bg)', paddingTop: '8rem', paddingBottom: '5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="wrapper_general">
                    <div style={TAG}>Our Work</div>
                    <h1 className="h1" style={{ maxWidth: 700 }}>Recent <span className="highlight">Projects</span></h1>
                    <p className="base_p" style={{ marginTop: '1.25rem', maxWidth: 580 }}>
                        A selection of completed plumbing, gas and electrical installations across residential and commercial properties.
                    </p>
                </div>
            </section>

            {/* Portfolio grid */}
            <section style={SECTION}>
                <div className="wrapper_general">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
                        {PROJECTS.map(p => (
                            <div key={p.title} style={{ ...CARD, overflow: 'hidden' }}>
                                <PlaceholderGraphic type={CAT_GRAPHIC[p.cat] ?? 'gas'} style={{ height: 220 }} />
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ ...TAG, marginBottom: '0.4rem' }}>{p.cat}</div>
                                    <h3 style={{ fontFamily: 'var(--abl-font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--abl-beige)', marginBottom: '0.5rem' }}>{p.title}</h3>
                                    <p className="base_p">{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section style={SECTION}>
                <div className="wrapper_general">
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div style={TAG}>Reviews</div>
                        <h2 className="h2 biege"><span className="highlight">Happy</span> Customers</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {TESTIMONIALS.map(t => (
                            <div key={t.name} style={{ ...CARD, padding: '2rem' }}>
                                <div style={{ color: '#ff6a00', marginBottom: '1rem' }}>★★★★★</div>
                                <p className="base_p" style={{ marginBottom: '1.5rem', fontStyle: 'italic' }}>"{t.text}"</p>
                                <div style={{ fontFamily: 'var(--abl-font-heading)', fontWeight: 700, color: 'var(--abl-beige)', fontSize: '0.9rem' }}>{t.name}</div>
                                <div className="base_p" style={{ fontSize: '0.8rem' }}>{t.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ ...SECTION, textAlign: 'center' }}>
                <div className="wrapper_general">
                    <h2 className="h2 biege" style={{ marginBottom: '0.75rem' }}>Want <span className="highlight">results like these?</span></h2>
                    <p className="base_p" style={{ marginBottom: '2rem' }}>Get in touch for a free quote on your next project.</p>
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

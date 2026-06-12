import { useCallback, useState } from 'react';
import { Head } from '@inertiajs/react';
import '@/ABetterLou/abl.css';
import Nav from '@/ABetterLou/Nav';
import MobileMenu from '@/ABetterLou/MobileMenu';
import ReserveModal from '@/ABetterLou/ReserveModal';
import SiteFooter from '@/ABetterLou/SiteFooter';
import PlaceholderGraphic, { type GraphicType } from '@/ABetterLou/PlaceholderGraphic';

const SERVICE_GRAPHIC: Record<string, GraphicType> = {
    '01': 'plumbing',
    '02': 'gas',
    '03': 'electrical',
};

const SERVICES = [
    {
        num: '01', title: 'Plumbing Services',
        desc: 'Complete domestic and commercial plumbing — from emergency repairs to full bathroom and kitchen installations.',
        items: ['Emergency plumbing repairs','Leak detection and repair','Bathroom and en-suite installation','Kitchen plumbing and re-plumbing','Central heating and radiator work','Pipe repair and replacement','Drainage and unblocking','Water pressure problems','Outdoor tap installation'],
    },
    {
        num: '02', title: 'Gas Services',
        desc: 'Gas Safe registered engineers providing boiler installations, servicing, safety certificates, and emergency gas work.',
        items: ['New boiler installation and replacement','Annual boiler servicing','Boiler repairs and fault finding','Landlord gas safety certificates (CP12)','Gas appliance installation and commissioning','Gas leak detection and repair','Gas meter relocation','Flue and ventilation checks','Power flushing'],
    },
    {
        num: '03', title: 'Electrical Services',
        desc: 'NICEIC approved electricians delivering safe, compliant electrical work for residential and commercial properties.',
        items: ['Full and partial electrical rewires','Consumer unit (fuse board) upgrades','Electrical Installation Condition Reports (EICR)','Socket, switch and light fitting installation','Fault finding and rectification','EV charger installation','Security and external lighting','Smoke and CO alarm installation','Emergency electrical call-out'],
    },
];

const TESTIMONIALS = [
    { text: 'Heat Spark replaced our boiler quickly and at a great price. Professional, tidy, and explained everything clearly. Couldn\'t recommend them more.', name: 'Sarah M.', role: 'Homeowner' },
    { text: 'Used Heat Spark for all our commercial electrical work. Reliable, properly certified, and always on time. Five stars without hesitation.', name: 'James T.', role: 'Property Manager' },
    { text: 'Called for an emergency gas issue late at night. Arrived quickly, sorted the problem professionally, gave us a full safety report. Brilliant.', name: 'David H.', role: 'Homeowner' },
];

const TAG: React.CSSProperties = { color: 'var(--abl-accent)', fontFamily: 'var(--abl-font-heading)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' };
const SECTION: React.CSSProperties = { padding: '6rem 0', background: 'var(--abl-bg)', borderTop: '1px solid rgba(255,255,255,0.06)' };
const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' };

export default function Services() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [modalOpen,  setModalOpen]  = useState(false);
    const openMobile  = useCallback(() => setMobileOpen(true),  []);
    const closeMobile = useCallback(() => setMobileOpen(false), []);
    const openModal   = useCallback(() => setModalOpen(true),   []);
    const closeModal  = useCallback(() => setModalOpen(false),  []);

    return (
        <div className="abl-root">
            <Head title="Services — Plumbing, Gas & Electrical | Heat Spark Energy">
                <meta name="description" content="Expert plumbing, gas and electrical services for homes and businesses. Gas Safe registered and NICEIC approved. Emergency call-out available." />
                <link rel="canonical" href="https://heatsparkenergy.co.uk/services" />
            </Head>

            <Nav onMenuOpen={openMobile} onGetQuote={openModal} />
            <MobileMenu open={mobileOpen} onClose={closeMobile} />
            <ReserveModal open={modalOpen} onClose={closeModal} />

            {/* Page hero */}
            <section style={{ background: 'var(--abl-bg)', paddingTop: '8rem', paddingBottom: '5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="wrapper_general">
                    <div style={TAG}>What We Offer</div>
                    <h1 className="h1" style={{ maxWidth: 700 }}>Our <span className="highlight">Services</span></h1>

                    <p className="base_p" style={{ marginTop: '1.25rem', maxWidth: 580 }}>
                        Domestic and commercial plumbing, gas and electrical services delivered by fully qualified, registered engineers.
                    </p>
                </div>
            </section>

            {/* Services blocks */}
            {SERVICES.map((s, i) => (
                <section key={s.num} style={SECTION}>
                    <div className="wrapper_general">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start', direction: i % 2 === 1 ? 'rtl' : 'ltr' }}>
                            <PlaceholderGraphic type={SERVICE_GRAPHIC[s.num] ?? 'plumbing'} style={{ ...CARD, minHeight: 420, direction: 'ltr' }} />
                            <div style={{ direction: 'ltr' }}>
                                <div style={{ fontFamily: 'var(--abl-font-heading)', fontSize: '4rem', fontWeight: 700, color: 'rgba(255,106,0,0.15)', lineHeight: 1, marginBottom: '0.5rem' }}>{s.num}</div>
                                <div style={TAG}>{s.title}</div>
                                <h2 className="h2 biege" style={{ marginBottom: '1rem' }}><span className="highlight">{s.title}</span></h2>
                                <p className="base_p" style={{ marginBottom: '1.5rem' }}>{s.desc}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                                    {s.items.map(item => (
                                        <div key={item} className="li_hero">
                                            <div className="dot_small" />
                                            <div className="base_p spec_line">{item}</div>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={openModal} className="button general" style={{ cursor: 'pointer', border: 'none' }}>
                                    <div className="buble_button">Get a Quote</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* Testimonials */}
            <section style={SECTION}>
                <div className="wrapper_general">
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div style={TAG}>Reviews</div>
                        <h2 className="h2 biege">What Our <span className="highlight">Customers Say</span></h2>
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
                    <h2 className="h2 biege" style={{ marginBottom: '0.75rem' }}>Need a <span className="highlight">quote?</span></h2>
                    <p className="base_p" style={{ marginBottom: '2rem' }}>Contact us today — we'll get back to you quickly with a fair, fixed price.</p>
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

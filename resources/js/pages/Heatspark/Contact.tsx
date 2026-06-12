import { useCallback, useState } from 'react';
import { Head } from '@inertiajs/react';
import '@/ABetterLou/abl.css';
import Nav from '@/ABetterLou/Nav';
import MobileMenu from '@/ABetterLou/MobileMenu';
import ReserveModal from '@/ABetterLou/ReserveModal';
import SiteFooter from '@/ABetterLou/SiteFooter';

const SERVICES_LIST = [
    'Plumbing — General', 'Plumbing — Emergency',
    'Gas — Boiler Installation', 'Gas — Boiler Service / Repair',
    'Gas — Landlord Safety Certificate (CP12)',
    'Electrical — Rewire', 'Electrical — Consumer Unit Upgrade',
    'Electrical — EICR', 'Electrical — General', 'Other',
];

interface FormState { firstName: string; lastName: string; email: string; phone: string; service: string; message: string; }

const TAG: React.CSSProperties = { color: 'var(--abl-accent)', fontFamily: 'var(--abl-font-heading)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' };
const SECTION: React.CSSProperties = { padding: '6rem 0', background: 'var(--abl-bg)', borderTop: '1px solid rgba(255,255,255,0.06)' };
const CARD: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem', padding: '2.5rem' };

const INPUT: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '0.5rem', color: 'var(--abl-beige)',
    fontFamily: 'var(--abl-font-body)', fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box',
};

const LABEL: React.CSSProperties = {
    display: 'block', marginBottom: '0.4rem',
    fontFamily: 'var(--abl-font-heading)', fontWeight: 600,
    fontSize: '0.75rem', color: 'var(--abl-beige)',
    letterSpacing: '0.08em', textTransform: 'uppercase',
};

export default function Contact() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [modalOpen,  setModalOpen]  = useState(false);
    const openMobile  = useCallback(() => setMobileOpen(true),  []);
    const closeMobile = useCallback(() => setMobileOpen(false), []);
    const openModal   = useCallback(() => setModalOpen(true),   []);
    const closeModal  = useCallback(() => setModalOpen(false),  []);

    const [form, setForm]     = useState<FormState>({ firstName: '', lastName: '', email: '', phone: '', service: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await fetch('/contact/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '' },
                body: JSON.stringify(form),
            });
            setStatus(res.ok ? 'success' : 'error');
            if (res.ok) setForm({ firstName: '', lastName: '', email: '', phone: '', service: '', message: '' });
        } catch { setStatus('error'); }
    };

    return (
        <div className="abl-root">
            <Head title="Contact Us — Heat Spark Energy Services">
                <meta name="description" content="Get in touch with Heat Spark Energy Services for a free quote. Call 07865 435 946 or use our contact form." />
                <link rel="canonical" href="https://heatsparkenergy.co.uk/contact" />
            </Head>

            <Nav onMenuOpen={openMobile} onGetQuote={openModal} />
            <MobileMenu open={mobileOpen} onClose={closeMobile} />
            <ReserveModal open={modalOpen} onClose={closeModal} />

            {/* Page hero */}
            <section style={{ background: 'var(--abl-bg)', paddingTop: '8rem', paddingBottom: '5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="wrapper_general">
                    <div style={TAG}>Get in Touch</div>
                    <h1 className="h1" style={{ maxWidth: 700 }}>Contact <span className="highlight">Us</span></h1>
                    <p className="base_p" style={{ marginTop: '1.25rem', maxWidth: 560 }}>
                        Fill in the form below or give us a call — we'll get back to you with a free, no-obligation quote.
                    </p>
                </div>
            </section>

            {/* Contact grid */}
            <section style={SECTION}>
                <div className="wrapper_general">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '4rem', alignItems: 'start' }}>

                        {/* Info column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <div style={TAG}>Contact Details</div>
                                <h2 className="h2 biege">Let's <span className="highlight">talk</span></h2>
                            </div>
                            {[
                                { label: 'Phone', body: <><a href="tel:07865435946" style={{ color: 'var(--abl-accent)', textDecoration: 'none', fontWeight: 700 }}>07865 435 946</a><p className="base_p" style={{ marginTop: '0.25rem' }}>Mon–Sat: 7am–7pm · Emergency: 24/7</p></> },
                                { label: 'Email', body: <><a href="mailto:admin@heatsparkenergy.co.uk" style={{ color: 'var(--abl-accent)', textDecoration: 'none', fontWeight: 700 }}>admin@heatsparkenergy.co.uk</a><p className="base_p" style={{ marginTop: '0.25rem' }}>We aim to reply within 2 hours.</p></> },
                                { label: 'Accreditations', body: <p className="base_p">Gas Safe Registered<br />NICEIC Approved Contractor<br />Fully Insured</p> },
                            ].map(item => (
                                <div key={item.label} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                                    <div style={{ fontFamily: 'var(--abl-font-heading)', fontWeight: 700, fontSize: '0.75rem', color: 'var(--abl-beige)', marginBottom: '0.4rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.label}</div>
                                    {item.body}
                                </div>
                            ))}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                                <div style={{ fontFamily: 'var(--abl-font-heading)', fontWeight: 700, fontSize: '0.75rem', color: 'var(--abl-beige)', marginBottom: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Follow Us</div>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <a href="https://www.facebook.com/HeatsparkenergY" target="_blank" rel="noopener noreferrer" className="button general">
                                        <div className="buble_button">Facebook</div>
                                    </a>
                                    <a href="https://wa.me/447865435946" target="_blank" rel="noopener noreferrer" className="button general">
                                        <div className="buble_button">WhatsApp</div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div style={CARD}>
                            <h2 style={{ fontFamily: 'var(--abl-font-heading)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--abl-beige)', marginBottom: '0.4rem' }}>Request a Free Quote</h2>
                            <p className="base_p" style={{ marginBottom: '1.75rem' }}>Tell us about your project and we'll get back to you fast.</p>

                            {status === 'success' && (
                                <div style={{ background: 'rgba(255,106,0,0.1)', border: '1px solid rgba(255,106,0,0.3)', borderRadius: '0.5rem', padding: '1rem 1.25rem', color: 'var(--abl-accent)', fontFamily: 'var(--abl-font-heading)', fontWeight: 600, marginBottom: '1.5rem' }}>
                                    Quote Request Received! We'll be in touch shortly.
                                </div>
                            )}
                            {status === 'error' && (
                                <div style={{ background: 'rgba(200,50,50,0.15)', border: '1px solid rgba(200,50,50,0.3)', borderRadius: '0.5rem', padding: '1rem 1.25rem', color: '#f87171', fontFamily: 'var(--abl-font-heading)', fontWeight: 600, marginBottom: '1.5rem' }}>
                                    Something went wrong. Please call 07865 435 946 instead.
                                </div>
                            )}

                            {status !== 'success' && (
                                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div><label style={LABEL} htmlFor="firstName">First Name *</label><input id="firstName" name="firstName" type="text" required value={form.firstName} onChange={change} style={INPUT} placeholder="Owen" /></div>
                                        <div><label style={LABEL} htmlFor="lastName">Last Name *</label><input id="lastName" name="lastName" type="text" required value={form.lastName} onChange={change} style={INPUT} placeholder="Davies" /></div>
                                    </div>
                                    <div><label style={LABEL} htmlFor="email">Email Address *</label><input id="email" name="email" type="email" required value={form.email} onChange={change} style={INPUT} placeholder="you@example.com" /></div>
                                    <div><label style={LABEL} htmlFor="phone">Phone Number</label><input id="phone" name="phone" type="tel" value={form.phone} onChange={change} style={INPUT} placeholder="07700 900000" /></div>
                                    <div>
                                        <label style={LABEL} htmlFor="service">Service Required</label>
                                        <select id="service" name="service" value={form.service} onChange={change} style={{ ...INPUT, cursor: 'pointer' }}>
                                            <option value="">Select a service…</option>
                                            {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div><label style={LABEL} htmlFor="message">Tell Us About Your Job *</label><textarea id="message" name="message" required value={form.message} onChange={change} style={{ ...INPUT, minHeight: 120, resize: 'vertical' }} placeholder="Please describe the work needed — any relevant details help us give an accurate quote." /></div>
                                    <button type="submit" className="button general" disabled={status === 'sending'} style={{ cursor: status === 'sending' ? 'not-allowed' : 'pointer', border: 'none', opacity: status === 'sending' ? 0.65 : 1, alignSelf: 'flex-start' }}>
                                        <div className="buble_button">{status === 'sending' ? 'Sending…' : 'Send Enquiry'}</div>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section style={{ background: 'var(--abl-bg)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.5!2d-3.17909!3d51.48158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDI4JzUzLjciTiAzwrAxMCc0NC43Ilc!5e0!3m2!1sen!2suk!4v1620000000000!5m2!1sen!2suk"
                    title="Heat Spark Energy Services location" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
                    style={{ width: '100%', height: 400, border: 'none', display: 'block', filter: 'grayscale(30%) contrast(0.9)' }} />
            </section>

            <SiteFooter />

            <a href="https://wa.me/447865435946" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
                style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.35)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
        </div>
    );
}

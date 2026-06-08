import { useState } from 'react';
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

const SERVICES_LIST = [
    'Plumbing — General',
    'Plumbing — Emergency',
    'Gas — Boiler Installation',
    'Gas — Boiler Service / Repair',
    'Gas — Landlord Safety Certificate (CP12)',
    'Electrical — Rewire',
    'Electrical — Consumer Unit Upgrade',
    'Electrical — EICR',
    'Electrical — General',
    'Other',
];

interface FormState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    service: string;
    message: string;
}

function ArrowIcon() {
    return (
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default function Contact() {
    const [form, setForm] = useState<FormState>({ firstName: '', lastName: '', email: '', phone: '', service: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await fetch('/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                },
                body: JSON.stringify(form),
            });
            setStatus(res.ok ? 'success' : 'error');
            if (res.ok) setForm({ firstName: '', lastName: '', email: '', phone: '', service: '', message: '' });
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="hs-root">
            <Head title="Contact Us — Heat Spark Energy Services">
                <meta name="description" content="Get in touch with Heat Spark Energy Services for a free quote. Call 07865 435 946 or use our contact form." />
                <link rel="canonical" href="https://heatsparkenergy.co.uk/contact" />
            </Head>

            <Nav />

            {/* Page Hero */}
            <section className="hs-page-hero">
                <div className="hs-wrap hs-page-hero-inner">
                    <div className="hs-breadcrumb">
                        <Link href="/">Home</Link><span> › </span><span>Contact</span>
                    </div>
                    <div className="hs-tag">Get in Touch</div>
                    <div className="hs-bar" />
                    <h1 className="hs-h1">Contact <em>Us</em></h1>
                    <p className="hs-lead" style={{ marginTop: '1rem', maxWidth: 560 }}>
                        Fill in the form below or give us a call — we'll get back to you with a free, no-obligation quote.
                    </p>
                </div>
            </section>

            {/* Contact section */}
            <section className="hs-section hs-contact-section">
                <div className="hs-wrap">
                    <div className="hs-contact-grid">
                        {/* Info */}
                        <div className="hs-contact-info">
                            <div>
                                <div className="hs-tag">Contact Details</div>
                                <div className="hs-bar" />
                            </div>
                            {[
                                { icon: '📞', title: 'Phone', content: <><a href="tel:07865435946">07865 435 946</a><p>Mon–Sat: 7am–7pm · Emergency: 24/7</p></> },
                                { icon: '✉️', title: 'Email', content: <><a href="mailto:admin@heatsparkenergy.co.uk">admin@heatsparkenergy.co.uk</a><p>We aim to reply within 2 hours.</p></> },
                                { icon: '🌐', title: 'Website', content: <a href="https://heatsparkenergy.co.uk">heatsparkenergy.co.uk</a> },
                                { icon: '🛡️', title: 'Accreditations', content: <p>Gas Safe Registered<br />NICEIC Approved Contractor<br />Fully Insured</p> },
                            ].map(item => (
                                <div key={item.title} className="hs-info-item">
                                    <div className="hs-info-icon">{item.icon}</div>
                                    <div className="hs-info-text">
                                        <h4>{item.title}</h4>
                                        {item.content}
                                    </div>
                                </div>
                            ))}
                            <div>
                                <h4 style={{ fontFamily: 'var(--hs-font-heading)', fontWeight: 700, color: 'var(--hs-text)', marginBottom: '0.75rem' }}>Follow Us</h4>
                                <div className="hs-btn-row">
                                    <a href="https://www.facebook.com/HeatsparkenergY" target="_blank" rel="noopener noreferrer" className="hs-social-pill-btn">📘 Facebook</a>
                                    <a href="https://wa.me/447865435946" target="_blank" rel="noopener noreferrer" className="hs-social-pill-btn">💬 WhatsApp</a>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="hs-form-card">
                            <div className="hs-form-heading">Request a Free Quote</div>
                            <div className="hs-form-sub">Tell us about your project and we'll get back to you fast.</div>

                            {status === 'success' && (
                                <div className="hs-form-success">
                                    ✅ Thanks! We've received your enquiry and will be in touch shortly.
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="hs-form-error">
                                    Something went wrong. Please call us on 07865 435 946 instead.
                                </div>
                            )}

                            {status !== 'success' && (
                                <form className="hs-form" onSubmit={submit}>
                                    <div className="hs-form-row">
                                        <div className="hs-form-group">
                                            <label className="hs-form-label" htmlFor="firstName">First Name *</label>
                                            <input id="firstName" name="firstName" type="text" required value={form.firstName} onChange={change} className="hs-form-input" placeholder="Owen" />
                                        </div>
                                        <div className="hs-form-group">
                                            <label className="hs-form-label" htmlFor="lastName">Last Name *</label>
                                            <input id="lastName" name="lastName" type="text" required value={form.lastName} onChange={change} className="hs-form-input" placeholder="Davies" />
                                        </div>
                                    </div>
                                    <div className="hs-form-group">
                                        <label className="hs-form-label" htmlFor="email">Email Address *</label>
                                        <input id="email" name="email" type="email" required value={form.email} onChange={change} className="hs-form-input" placeholder="you@example.com" />
                                    </div>
                                    <div className="hs-form-group">
                                        <label className="hs-form-label" htmlFor="phone">Phone Number</label>
                                        <input id="phone" name="phone" type="tel" value={form.phone} onChange={change} className="hs-form-input" placeholder="07700 900000" />
                                    </div>
                                    <div className="hs-form-group">
                                        <label className="hs-form-label" htmlFor="service">Service Required</label>
                                        <select id="service" name="service" value={form.service} onChange={change} className="hs-form-select">
                                            <option value="">Select a service…</option>
                                            {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="hs-form-group">
                                        <label className="hs-form-label" htmlFor="message">Tell Us About Your Job *</label>
                                        <textarea id="message" name="message" required value={form.message} onChange={change} className="hs-form-textarea" placeholder="Please describe the work needed — any relevant details help us give an accurate quote." />
                                    </div>
                                    <button
                                        type="submit"
                                        className="hs-pill"
                                        style={{ width: '100%', justifyContent: 'center' }}
                                        disabled={status === 'sending'}
                                    >
                                        <span>{status === 'sending' ? 'Sending…' : 'Send Enquiry'}</span>
                                        {status !== 'sending' && <span className="hs-pill-circle"><ArrowIcon /></span>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section className="hs-section hs-map-section" style={{ padding: '3rem 0' }}>
                <div className="hs-wrap">
                    <div className="hs-map-wrap">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.5!2d-3.17909!3d51.48158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDI4JzUzLjciTiAzwrAxMCc0NC43Ilc!5e0!3m2!1sen!2suk!4v1620000000000!5m2!1sen!2suk"
                            title="Heat Spark Energy Services location"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>

            <Footer />
            <ChatWidget />
        </div>
    );
}

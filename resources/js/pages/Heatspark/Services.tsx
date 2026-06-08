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

const SERVICES = [
    {
        num: '01', icon: '🔧', title: 'Plumbing Services',
        desc: 'Complete domestic and commercial plumbing — from emergency repairs to full bathroom and kitchen installations.',
        img: '/images/WorcesterBoschGreenstarBoiler.webp',
        items: [
            'Emergency plumbing repairs',
            'Leak detection and repair',
            'Bathroom and en-suite installation',
            'Kitchen plumbing and re-plumbing',
            'Central heating and radiator work',
            'Pipe repair and replacement',
            'Drainage and unblocking',
            'Water pressure problems',
            'Outdoor tap installation',
        ],
    },
    {
        num: '02', icon: '🔥', title: 'Gas Services', reverse: true,
        desc: 'Gas Safe registered engineers providing boiler installations, servicing, safety certificates, and emergency gas work.',
        img: '/images/optimised/gas-boiler-vaillant-vmw-23cs-1-5-cf-ecotec-plus-removebg-preview.webp',
        items: [
            'New boiler installation and replacement',
            'Annual boiler servicing',
            'Boiler repairs and fault finding',
            'Landlord gas safety certificates (CP12)',
            'Gas appliance installation and commissioning',
            'Gas leak detection and repair',
            'Gas meter relocation',
            'Flue and ventilation checks',
            'Power flushing',
        ],
    },
    {
        num: '03', icon: '⚡', title: 'Electrical Services',
        desc: 'NICEIC approved electricians delivering safe, compliant electrical work for residential and commercial properties.',
        img: '/images/Logic_System_IE_Front_Facing.webp',
        items: [
            'Full and partial electrical rewires',
            'Consumer unit (fuse board) upgrades',
            'Electrical Installation Condition Reports (EICR)',
            'Socket, switch and light fitting installation',
            'Fault finding and rectification',
            'EV charger installation',
            'Security and external lighting',
            'Smoke and CO alarm installation',
            'Emergency electrical call-out',
        ],
    },
];

const TESTIMONIALS = [
    {
        text: 'Heat Spark replaced our boiler quickly and at a great price. The engineer was professional, tidy, and explained everything clearly. Couldn\'t recommend them more.',
        name: 'Sarah M.',
        role: 'Homeowner',
    },
    {
        text: 'Used Heat Spark for all our commercial electrical work across two properties. Reliable, properly certified, and always on time. Five stars without hesitation.',
        name: 'James T.',
        role: 'Property Manager',
    },
    {
        text: 'Called them for an emergency gas issue late at night. Arrived quickly, sorted the problem professionally, and gave us a full safety report. Brilliant service.',
        name: 'David H.',
        role: 'Homeowner',
    },
];

function ArrowIcon() {
    return (
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default function Services() {
    return (
        <div className="hs-root">
            <Head title="Services — Plumbing, Gas & Electrical | Heat Spark Energy">
                <meta name="description" content="Expert plumbing, gas and electrical services for homes and businesses. Gas Safe registered and NICEIC approved. Emergency call-out available." />
                <link rel="canonical" href="https://heatsparkenergy.co.uk/services" />
            </Head>

            <Nav />

            {/* Page Hero */}
            <section className="hs-page-hero">
                <div className="hs-wrap hs-page-hero-inner">
                    <div className="hs-breadcrumb">
                        <Link href="/">Home</Link><span> › </span><span>Services</span>
                    </div>
                    <div className="hs-tag">What We Offer</div>
                    <div className="hs-bar" />
                    <h1 className="hs-h1">Our <em>Services</em></h1>
                    <p className="hs-lead" style={{ marginTop: '1rem', maxWidth: 580 }}>
                        Domestic and commercial plumbing, gas and electrical services delivered by fully qualified, registered engineers.
                    </p>
                </div>
            </section>

            {/* Services Detail */}
            <section className="hs-section hs-services-detail-section">
                <div className="hs-wrap">
                    {SERVICES.map(s => (
                        <div key={s.num} className={`hs-service-block${s.reverse ? ' reverse' : ''}`}>
                            <img
                                src={s.img}
                                alt={s.title}
                                className="hs-feature-img-contain"
                                loading="lazy"
                            />
                            <div className="hs-service-block-content">
                                <div className="hs-service-block-num">{s.num}</div>
                                <div className="hs-tag">{s.icon} {s.title}</div>
                                <div className="hs-bar" />
                                <h2 className="hs-h2">{s.title}</h2>
                                <p className="hs-lead">{s.desc}</p>
                                <ul className="hs-bullet-list">
                                    {s.items.map(item => <li key={item}>{item}</li>)}
                                </ul>
                                <div className="hs-btn-row" style={{ marginTop: '1rem' }}>
                                    <Link href="/contact" className="hs-pill">
                                        <span>Get a Quote</span>
                                        <span className="hs-pill-circle"><ArrowIcon /></span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="hs-section hs-testimonials-section">
                <div className="hs-wrap">
                    <div className="hs-section-header">
                        <div className="hs-tag">Reviews</div>
                        <div className="hs-bar" />
                        <h2 className="hs-h2">What Our Customers Say</h2>
                    </div>
                    <div className="hs-testimonials-grid">
                        {TESTIMONIALS.map(t => (
                            <div key={t.name} className="hs-testimonial-card">
                                <div className="hs-stars">★★★★★</div>
                                <p className="hs-review-text">"{t.text}"</p>
                                <div className="hs-reviewer">
                                    <div className="hs-reviewer-name">{t.name}</div>
                                    <div className="hs-reviewer-role">{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="hs-cta-banner">
                <div className="hs-wrap">
                    <div className="hs-cta-inner">
                        <div>
                            <h2 className="hs-h2">Need a quote?</h2>
                            <p>Contact us today — we'll get back to you quickly with a fair, fixed price.</p>
                        </div>
                        <div className="hs-btn-row">
                            <Link href="/contact" className="hs-pill hs-pill-white">
                                <span>Request a Quote</span>
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

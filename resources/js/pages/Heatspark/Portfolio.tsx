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

const PROJECTS = [
    {
        img: '/images/WorcesterBoschGreenstarBoiler.webp',
        contain: true,
        cat: 'Gas', title: 'Worcester Bosch Greenstar Installation',
        desc: 'Full boiler replacement with a new Worcester Bosch Greenstar combi. Completed same day, no disruption to the household.',
    },
    {
        img: '/images/optimised/gas-boiler-vaillant-vmw-23cs-1-5-cf-ecotec-plus-removebg-preview.webp',
        contain: true,
        cat: 'Gas', title: 'Vaillant EcoTec Combi Replacement',
        desc: 'New Vaillant EcoTec Plus installed including full system flush and magnetic filter. 10-year warranty registered.',
    },
    {
        img: '/images/Logic_System_IE_Front_Facing.webp',
        contain: true,
        cat: 'Gas', title: 'Logic System — Commercial Premises',
        desc: 'Logic System boiler fitted for a commercial site. Full commissioning, gas safety check, and landlord certification.',
    },
    {
        img: '/images/optimised/598845316_716187218209060_515352522120168966_n.webp',
        contain: false,
        cat: 'Plumbing', title: 'Full Bathroom Re-Fit',
        desc: 'Complete bathroom strip-out and re-fit including new suite, tiling, and all associated plumbing for a residential property.',
    },
    {
        img: '/images/optimised/598934951_716187244875724_5873043382233951837_n.webp',
        contain: false,
        cat: 'Plumbing', title: 'Central Heating System Upgrade',
        desc: 'Full central heating upgrade including new radiators, pipework, and smart thermostat controls throughout a 4-bed house.',
    },
    {
        img: '/images/optimised/602356195_716187341542381_988282437403626983_n.webp',
        contain: false,
        cat: 'Electrical', title: 'Consumer Unit Upgrade',
        desc: 'Full consumer unit replacement with new RCD-protected board, tested and certified to current BS7671 standards.',
    },
];

const TESTIMONIALS = [
    {
        text: 'Owen and the team sorted our bathroom from scratch — stripped it out and fitted a brand new suite. Immaculate finish. Absolutely delighted.',
        name: 'Mrs. Williams', role: 'Residential Customer',
    },
    {
        text: 'Heat Spark fitted a new boiler and serviced the whole heating system. Everything running perfectly. Professional from start to finish.',
        name: 'Mr. Thompson', role: 'Landlord',
    },
    {
        text: 'Had them rewire our kitchen and upgrade the consumer unit. Clean, tidy, no fuss. Great communication throughout. Would definitely use again.',
        name: 'Rachel P.', role: 'Homeowner',
    },
];

function ArrowIcon() {
    return (
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default function Portfolio() {
    return (
        <div className="hs-root">
            <Head title="Portfolio — Our Work | Heat Spark Energy Services">
                <meta name="description" content="See examples of our plumbing, gas and electrical work. Boiler installations, bathroom fits, consumer units and more." />
                <link rel="canonical" href="https://heatsparkenergy.co.uk/portfolio" />
            </Head>

            <Nav />

            <section className="hs-page-hero">
                <div className="hs-wrap hs-page-hero-inner">
                    <div className="hs-breadcrumb">
                        <Link href="/">Home</Link><span> › </span><span>Portfolio</span>
                    </div>
                    <div className="hs-tag">Our Work</div>
                    <div className="hs-bar" />
                    <h1 className="hs-h1">Recent <em>Projects</em></h1>
                    <p className="hs-lead" style={{ marginTop: '1rem', maxWidth: 580 }}>
                        A selection of completed plumbing, gas and electrical installations across residential and commercial properties.
                    </p>
                </div>
            </section>

            <section className="hs-section hs-portfolio-section">
                <div className="hs-wrap">
                    <div className="hs-portfolio-grid">
                        {PROJECTS.map(p => (
                            <div key={p.title} className="hs-portfolio-card">
                                <div className="hs-portfolio-img-wrap">
                                    <img
                                        src={p.img}
                                        alt={p.title}
                                        className={p.contain ? 'hs-portfolio-img-contain' : 'hs-portfolio-img'}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="hs-portfolio-body">
                                    <div className="hs-portfolio-cat">{p.cat}</div>
                                    <h3>{p.title}</h3>
                                    <p>{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="hs-section hs-testimonials-section">
                <div className="hs-wrap">
                    <div className="hs-section-header">
                        <div className="hs-tag">Reviews</div>
                        <div className="hs-bar" />
                        <h2 className="hs-h2">Happy Customers</h2>
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

            <section className="hs-cta-banner">
                <div className="hs-wrap">
                    <div className="hs-cta-inner">
                        <div>
                            <h2 className="hs-h2">Want results like these?</h2>
                            <p>Get in touch for a free quote on your next project.</p>
                        </div>
                        <div className="hs-btn-row">
                            <Link href="/contact" className="hs-pill hs-pill-white">
                                <span>Get a Free Quote</span>
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

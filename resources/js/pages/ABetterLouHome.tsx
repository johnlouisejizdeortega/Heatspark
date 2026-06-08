import { useCallback, useState } from 'react';
import { Head } from '@inertiajs/react';
import '@/ABetterLou/abl.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/roboto/400.css';

import Nav from '@/ABetterLou/Nav';
import MobileMenu from '@/ABetterLou/MobileMenu';
import ReserveModal from '@/ABetterLou/ReserveModal';
import HeroSection from '@/ABetterLou/HeroSection';
import ClockSection from '@/ABetterLou/ClockSection';
import TeamCarousel from '@/ABetterLou/TeamCarousel';
import MovementSection from '@/ABetterLou/MovementSection';
import HowItWorksSection from '@/ABetterLou/HowItWorksSection';
import MetabolicSection from '@/ABetterLou/MetabolicSection';
import MindsetSection from '@/ABetterLou/MindsetSection';
import ProgramsSection from '@/ABetterLou/ProgramsSection';
import FaqSection from '@/ABetterLou/FaqSection';
import BlogSection from '@/ABetterLou/BlogSection';
import QuoteSection from '@/ABetterLou/QuoteSection';
import CtaSection from '@/ABetterLou/CtaSection';
import SiteFooter from '@/ABetterLou/SiteFooter';

const PAGE_TITLE = 'Heat Spark Energy Services — Plumbing, Gas & Electrical';
const PAGE_DESC =
    'Expert domestic and commercial plumbing, gas and electrical services. Gas Safe registered and NICEIC approved engineers. Emergency call-out available 24/7.';

const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Heat Spark Energy Services Ltd',
    description: 'Expert domestic and commercial plumbing, gas and electrical services. Gas Safe registered and NICEIC approved.',
    url: 'https://heatsparkenergy.co.uk',
    logo: {
        '@type': 'ImageObject',
        url: 'https://heatsparkenergy.co.uk/images/Brand-Logo-2.avif',
    },
    telephone: '07865435946',
    email: 'admin@heatsparkenergy.co.uk',
    founder: { '@type': 'Person', name: 'Owen Davies' },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services',
        itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Plumbing Services', serviceType: 'Plumbing' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gas Services', serviceType: 'Gas Engineering' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Electrical Services', serviceType: 'Electrical Engineering' } },
        ],
    },
};

export default function ABetterLouHome() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const openMobile  = useCallback(() => setMobileOpen(true), []);
    const closeMobile = useCallback(() => setMobileOpen(false), []);
    const openModal   = useCallback(() => setModalOpen(true), []);
    const closeModal  = useCallback(() => setModalOpen(false), []);

    return (
        <div className="abl-root">
            <Head title={PAGE_TITLE}>
                <meta name="description" content={PAGE_DESC} />
                <meta property="og:title" content="Heat Spark Energy Services Ltd" />
                <meta property="og:description" content={PAGE_DESC} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Heat Spark Energy Services Ltd" />
                <meta name="twitter:description" content={PAGE_DESC} />
                <meta name="robots" content="index,follow" />
                <link rel="canonical" href="https://heatsparkenergy.co.uk/" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
            </Head>

            {/* Navigation */}
            <Nav onMenuOpen={openMobile} onGetQuote={openModal} />

            {/* Mobile drawer */}
            <MobileMenu open={mobileOpen} onClose={closeMobile} />

            {/* Quote modal */}
            <ReserveModal open={modalOpen} onClose={closeModal} />

            {/* Page sections */}
            <HeroSection onGetQuote={openModal} />
            <ClockSection />
            <TeamCarousel />
            <MovementSection onGetQuote={openModal} />
            <HowItWorksSection onGetQuote={openModal} />
            <MetabolicSection onGetQuote={openModal} />
            <MindsetSection onGetQuote={openModal} />
            <ProgramsSection onGetQuote={openModal} />
            <FaqSection />
            <BlogSection />
            <QuoteSection />
            <CtaSection onGetQuote={openModal} />
            <SiteFooter />

            {/* WhatsApp floating button */}
            <a
                href="https://wa.me/447865435946"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                style={{
                    position: 'fixed',
                    bottom: '1.5rem',
                    right: '1.5rem',
                    zIndex: 9999,
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '50%',
                    background: '#25d366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                    transition: 'transform 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>
        </div>
    );
}

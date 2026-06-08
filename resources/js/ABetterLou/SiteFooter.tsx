const LOGO = '/images/Brand-Logo-2.avif';

const NAV_COLS = [
    {
        label: 'Services',
        links: [
            { label: 'Plumbing', href: '/services' },
            { label: 'Gas Services', href: '/services' },
            { label: 'Electrical', href: '/services' },
            { label: 'Portfolio', href: '/portfolio' },
        ],
    },
    {
        label: 'Company',
        links: [
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Facebook', href: 'https://www.facebook.com/HeatsparkenergY' },
        ],
    },
    {
        label: 'Accreditations',
        links: [
            { label: 'Gas Safe Registered', href: '#' },
            { label: 'NICEIC Approved', href: '#' },
            { label: 'Fully Insured', href: '#' },
            { label: 'Privacy Policy', href: '/privacy' },
        ],
    },
    {
        label: 'Contact',
        links: [
            { label: '07865 435 946', href: 'tel:07865435946' },
            { label: 'admin@heatsparkenergy.co.uk', href: 'mailto:admin@heatsparkenergy.co.uk' },
            { label: 'heatsparkenergy.co.uk', href: 'https://heatsparkenergy.co.uk' },
        ],
    },
];

export default function SiteFooter() {
    return (
        <footer className="site_footer">
            <div className="wrapper_general">
                <div className="wrapper_footer">
                    <div className="flex_footer">
                        {/* Brand column */}
                        <div className="footer_brand">
                            <img src={LOGO} alt="Heat Spark Energy Services" className="image footer_logo" loading="lazy" />
                            <div className="footer_tagline base_p">
                                Expert domestic and commercial plumbing, gas and electrical services.
                            </div>
                            <div className="subscription_form">
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                    <a
                                        href="https://www.facebook.com/HeatsparkenergY"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer_link base_p"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                                    >
                                        Facebook
                                    </a>
                                    <a
                                        href="https://wa.me/447865435946"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer_link base_p"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                                    >
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Nav columns */}
                        <div className="grid_links">
                            {NAV_COLS.map(col => (
                                <div key={col.label} className="footer_col">
                                    <div className="footer_col_label">{col.label}</div>
                                    {col.links.map(link => (
                                        <a key={link.label} href={link.href} className="footer_link base_p">
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="bottom_footer">
                        <div className="footer_copy base_p">
                            © {new Date().getFullYear()} Heat Spark Energy Services Ltd. All rights reserved.
                        </div>
                        <div className="footer_legal base_p">
                            Gas Safe Registered. NICEIC Approved Contractor. All engineers fully qualified and insured. Heat Spark Energy Services Ltd is registered in England and Wales.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

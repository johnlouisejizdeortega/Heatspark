import { useCallback, useEffect, useRef, useState } from 'react';

const CDN = 'https://cdn.prod.website-files.com/6939a31d6f0751cc94b4a574';
const ARROW = `${CDN}/6951317f9e7c4fc62f2c0c81_arrow.svg`;
const PLUS_ICON = `${CDN}/695eb6d83d09b4baa1cb25b0_plus_included.png`;

// TODO: replace with real logo when available
const LOGO_PLACEHOLDER_STYLE: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '0.4rem 0.85rem', border: '2px solid var(--abl-accent, #ffb442)',
    borderRadius: '6px', color: 'var(--abl-accent, #ffb442)',
    fontFamily: 'var(--abl-font-heading)', fontWeight: 700,
    fontSize: '0.9rem', letterSpacing: '0.05em', whiteSpace: 'nowrap',
    textDecoration: 'none',
};

type NavProps = {
    onMenuOpen: () => void;
    onGetQuote: () => void;
};

function ArrowCircle({ className = 'circle_general' }: { className?: string }) {
    return (
        <div className={className}>
            <div className="arrow_general">
                <img src={ARROW} alt="" className="image" loading="lazy" />
            </div>
            <div className="abs_arrow">
                <img src={ARROW} alt="" className="image" loading="lazy" />
            </div>
        </div>
    );
}

export default function Nav({ onMenuOpen, onGetQuote }: NavProps) {
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [hasBg, setHasBg] = useState(false);
    const headerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const onScroll = () => setHasBg(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const openSubmenu = useCallback(() => setSubmenuOpen(true), []);
    const closeSubmenu = useCallback(() => setSubmenuOpen(false), []);

    const handleHeaderMouseLeave = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (!submenuOpen) return;
            const to = e.relatedTarget as Node | null;
            if (to && headerRef.current?.contains(to)) return;
            closeSubmenu();
        },
        [submenuOpen, closeSubmenu],
    );

    const cls = ['header navigation', hasBg || submenuOpen ? 'has-background' : '', submenuOpen ? 'has-submenu-open' : '']
        .filter(Boolean)
        .join(' ');

    return (
        <nav ref={headerRef} className={cls} onMouseLeave={handleHeaderMouseLeave}>
            <div className="wrapper_header">
                <div className="flex_header">
                    {/* Logo */}
                    <div className="logo_box">
                        <a href="/" style={LOGO_PLACEHOLDER_STYLE}>HEAT SPARK</a>
                    </div>

                    {/* Desktop nav */}
                    <div className="menu">
                        <a href="/" className="h_link"><div>Home</div></a>
                        <a href="/about" className="h_link"><div>About</div></a>
                        <button
                            type="button"
                            className="h_link"
                            onClick={() => setSubmenuOpen(v => !v)}
                            aria-expanded={submenuOpen}
                            aria-haspopup="true"
                        >
                            <div>Services</div>
                            <div className="plus_dropdown">
                                <img src={PLUS_ICON} loading="lazy" alt="" className="image" />
                            </div>
                        </button>
                        <a href="/portfolio" className="h_link"><div>Portfolio</div></a>
                        <a href="/contact" className="h_link"><div>Contact</div></a>
                    </div>

                    {/* CTA buttons */}
                    <div className="button_cta">
                        <a href="tel:07865435946" className="button">
                            <div className="button_main">Call 07865 435 946</div>
                        </a>
                        <button type="button" className="button" onClick={onGetQuote}>
                            <div className="button_main">Get a Free Quote</div>
                            <ArrowCircle className="circle_main" />
                        </button>
                    </div>

                    {/* Hamburger */}
                    <button type="button" className="hamburger" onClick={onMenuOpen} aria-label="Open menu">
                        <div className="menu_txt open">Menu</div>
                        <div className="circle_hamb">
                            <div className="line_f" />
                            <div className="line_s" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Dropdown submenu — Services */}
            <div className={`sub-menu${submenuOpen ? ' is-open' : ''}`} onMouseEnter={openSubmenu}>
                <div className="sub-wrapper">
                    <div className="flex_memberships">
                        <div className="title_sub">
                            <div className="title_submenu">
                                Domestic &amp; commercial<br />services
                            </div>
                        </div>
                        <div className="items_memberships">
                            <a href="/services" className="membership_link" onClick={closeSubmenu}>
                                <div className="above_info">
                                    <div className="icon_circle">
                                        <div className="arrow_general">
                                            <img src={ARROW} loading="lazy" alt="" className="image" />
                                        </div>
                                        <div className="abs_arrow">
                                            <img src={ARROW} loading="lazy" alt="" className="image" />
                                        </div>
                                    </div>
                                    <div className="title_membership">
                                        <div className="txt_membership">Plumbing Services</div>
                                    </div>
                                </div>
                                <div className="overlay_membership" />
                                <div className="image_back" style={{ background: 'var(--abl-brown-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--abl-accent)', fontFamily: 'var(--abl-font-heading)', fontSize: '0.8rem' }}>
                                    [Plumbing image]
                                </div>
                            </a>
                            <a href="/services" className="membership_link" onClick={closeSubmenu}>
                                <div className="above_info">
                                    <div className="icon_circle">
                                        <div className="arrow_general">
                                            <img src={ARROW} loading="lazy" alt="" className="image" />
                                        </div>
                                        <div className="abs_arrow">
                                            <img src={ARROW} loading="lazy" alt="" className="image" />
                                        </div>
                                    </div>
                                    <div className="title_membership">
                                        <div className="txt_membership">Gas &amp; Electrical</div>
                                    </div>
                                </div>
                                <div className="overlay_membership" />
                                <div className="image_back" style={{ background: 'var(--abl-brown-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--abl-accent)', fontFamily: 'var(--abl-font-heading)', fontSize: '0.8rem' }}>
                                    [Gas &amp; Electrical image]
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

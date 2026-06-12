import { useCallback, useEffect, useRef, useState } from 'react';
import PlaceholderGraphic from '@/ABetterLou/PlaceholderGraphic';

const CDN = 'https://cdn.prod.website-files.com/6939a31d6f0751cc94b4a574';
const ARROW = `${CDN}/6951317f9e7c4fc62f2c0c81_arrow.svg`;

const LOGO_WRAP: React.CSSProperties = {
    flexShrink: 0,
};
const LOGO_STYLE: React.CSSProperties = {
    height: '62px', width: 'auto', display: 'block',
};

type NavProps = {
    onMenuOpen: () => void;
    onGetQuote: () => void;
};


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
                        <a href="/" style={LOGO_WRAP}><img src="/images/Untitled-1.webp" alt="Heat Spark Energy Services" style={LOGO_STYLE} /></a>
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
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 0.3s', transform: submenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </button>
                        <a href="/portfolio" className="h_link"><div>Portfolio</div></a>
                        <a href="/contact" className="h_link"><div>Contact</div></a>
                    </div>

                    {/* CTA buttons */}
                    <div className="button_cta">
                        <button type="button" className="button" onClick={onGetQuote}>
                            <div className="button_main">Get a Free Quote</div>
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
                                <PlaceholderGraphic type="plumbing" className="image_back" />
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
                                <PlaceholderGraphic type="gas" className="image_back" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

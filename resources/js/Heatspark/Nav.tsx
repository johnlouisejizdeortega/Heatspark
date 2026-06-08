import { useState } from 'react';
import { Link } from '@inertiajs/react';

const LOGO = '/images/Brand-Logo-2.avif';
const PHONE = '07865435946';
const PHONE_DISPLAY = '07865 435 946';

const LINKS = [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/contact' },
];

function ArrowIcon() {
    return (
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default function Nav() {
    const [open, setOpen] = useState(false);
    const current = typeof window !== 'undefined' ? window.location.pathname : '/';

    return (
        <>
            <nav className="hs-nav">
                <div className="hs-wrap hs-nav-inner">
                    <Link href="/" className="hs-nav-logo">
                        <img
                            src={LOGO}
                            alt="Heat Spark Energy Services"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="hs-nav-brand">
                            <span className="hs-nav-brand-name">Heat Spark</span>
                            <span className="hs-nav-brand-sub">Energy Services Ltd</span>
                        </div>
                    </Link>

                    <div className="hs-nav-links">
                        {LINKS.map(l => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={`hs-nav-link${current === l.href ? ' active' : ''}`}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hs-nav-right">
                        <a href={`tel:${PHONE}`} className="hs-nav-phone">{PHONE_DISPLAY}</a>
                        <Link href="/contact" className="hs-pill">
                            <span>Get a Quote</span>
                            <span className="hs-pill-circle"><ArrowIcon /></span>
                        </Link>
                        <button className="hs-hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
                            <span /><span /><span />
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`hs-mobile-nav${open ? ' open' : ''}`}>
                <Link href="/" onClick={() => setOpen(false)}>Home</Link>
                {LINKS.map(l => (
                    <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
                ))}
                <Link href="/contact" className="hs-pill" onClick={() => setOpen(false)}>
                    <span>Get a Free Quote</span>
                    <span className="hs-pill-circle"><ArrowIcon /></span>
                </Link>
                <a href={`tel:${PHONE}`} style={{ color: 'var(--hs-accent)', fontWeight: 700 }} onClick={() => setOpen(false)}>
                    📞 {PHONE_DISPLAY}
                </a>
            </div>
        </>
    );
}

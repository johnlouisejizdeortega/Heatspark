import { Link } from '@inertiajs/react';

const LOGO = '/images/Brand-Logo-2.avif';

export default function Footer() {
    return (
        <footer className="hs-footer">
            <div className="hs-wrap">
                <div className="hs-footer-grid">
                    <div className="hs-footer-brand">
                        <img
                            src={LOGO}
                            alt="Heat Spark"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="hs-footer-brand-name">Heat Spark Energy Services Ltd</div>
                        <div className="hs-footer-brand-sub">Plumbing · Gas · Electrical</div>
                        <p>Trusted domestic and commercial specialists delivering safe, reliable plumbing, gas and electrical services.</p>
                    </div>

                    <div>
                        <div className="hs-footer-col-title">Pages</div>
                        <div className="hs-footer-links">
                            <Link href="/" className="hs-footer-link">Home</Link>
                            <Link href="/about" className="hs-footer-link">About Us</Link>
                            <Link href="/services" className="hs-footer-link">Services</Link>
                            <Link href="/portfolio" className="hs-footer-link">Portfolio</Link>
                            <Link href="/contact" className="hs-footer-link">Contact</Link>
                        </div>
                    </div>

                    <div>
                        <div className="hs-footer-col-title">Services</div>
                        <div className="hs-footer-links">
                            <Link href="/services" className="hs-footer-link">Plumbing</Link>
                            <Link href="/services" className="hs-footer-link">Gas Services</Link>
                            <Link href="/services" className="hs-footer-link">Electrical</Link>
                            <Link href="/services" className="hs-footer-link">Boiler Installation</Link>
                            <Link href="/services" className="hs-footer-link">Emergency Call-Out</Link>
                        </div>
                    </div>

                    <div>
                        <div className="hs-footer-col-title">Contact</div>
                        <div className="hs-footer-links">
                            <a href="tel:07865435946" className="hs-footer-link">07865 435 946</a>
                            <a href="mailto:admin@heatsparkenergy.co.uk" className="hs-footer-link">admin@heatsparkenergy.co.uk</a>
                            <a href="https://www.facebook.com/HeatsparkenergY" target="_blank" rel="noopener noreferrer" className="hs-footer-link">Facebook</a>
                            <a href="https://wa.me/447865435946" target="_blank" rel="noopener noreferrer" className="hs-footer-link">WhatsApp</a>
                        </div>
                    </div>
                </div>

                <div className="hs-footer-bottom">
                    <div className="hs-footer-copy">
                        © {new Date().getFullYear()} Heat Spark Energy Services Ltd. All rights reserved.
                    </div>
                    <div className="hs-footer-regs">
                        <span className="hs-footer-reg">Gas Safe Registered</span>
                        <span className="hs-footer-reg">NICEIC Approved</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

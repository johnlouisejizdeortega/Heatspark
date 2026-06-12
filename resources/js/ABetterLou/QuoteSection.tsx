export default function QuoteSection() {
    return (
        <section className="quote_section">
            <div className="wrapper_general">
                <div className="big_quote">
                    <div className="quote_mark">"</div>
                    <blockquote className="ch_quote">
                        We treat every property as if it were our own. Clean, safe, high-quality work — no exceptions, no shortcuts.
                    </blockquote>
                    <div className="author_box">
                        <div
                            className="image author_photo"
                            style={{
                                background: 'var(--abl-brown-dark, #1a1a1a)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                fontFamily: 'var(--abl-font-heading)',
                                fontWeight: 700,
                                color: 'var(--abl-accent, #ff6a00)',
                                borderRadius: '50%',
                                width: '72px',
                                height: '72px',
                                flexShrink: 0,
                            }}
                        >
                            OD
                        </div>
                        <div className="quote_caption">
                            <div className="author_name">Owen Davies</div>
                            <div className="author_role">Director, Heat Spark Energy Services Ltd</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

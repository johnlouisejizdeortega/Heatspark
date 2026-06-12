import { useState } from 'react';

const GROUPS = [
    {
        label: 'Our Services',
        items: [
            {
                q: 'What areas do you cover?',
                a: 'Heat Spark Energy Services covers domestic and commercial properties across the region. Contact us to confirm availability in your specific area — we\'re always happy to discuss your job.',
            },
            {
                q: 'Do you carry out emergency call-outs?',
                a: 'Yes. We offer 24/7 emergency call-outs for urgent plumbing, gas and electrical issues — including burst pipes, gas leaks, and complete power failures. Call 07865 435 946 any time.',
            },
            {
                q: 'Can you handle both domestic and commercial work?',
                a: 'Absolutely. We work with homeowners, landlords, and businesses of all sizes. Whether it\'s a single repair or a multi-site commercial contract, we have the team and qualifications to handle it.',
            },
            {
                q: 'Do you work weekends?',
                a: 'Yes — we\'re available Monday to Saturday 7am–7pm for standard work, and 24/7 for genuine emergencies. Contact us to check availability and book a time that works for you.',
            },
        ],
    },
    {
        label: 'Pricing & Booking',
        items: [
            {
                q: 'How do I get a quote?',
                a: 'Call us on 07865 435 946, fill in our contact form, or message us on WhatsApp. We\'ll get back to you quickly with a free, no-obligation quote based on your job.',
            },
            {
                q: 'Do you charge a call-out fee?',
                a: 'We aim to be transparent about all costs before any work begins. Where a call-out fee applies, we will always tell you upfront — no surprises.',
            },
            {
                q: 'How quickly can you come out?',
                a: 'For emergencies, we aim to respond as fast as possible — often same day. For planned work, we\'ll agree a date and time that suits you.',
            },
            {
                q: 'Do you provide written quotes?',
                a: 'Yes. We always provide clear, written quotes before work begins so you know exactly what to expect. We stick to our quotes — no hidden charges.',
            },
        ],
    },
    {
        label: 'Certificates & Compliance',
        items: [
            {
                q: 'What is a CP12 gas safety certificate?',
                a: 'A CP12 (landlord gas safety record) is a legal requirement for rental properties. It certifies that all gas appliances and flues have been inspected by a Gas Safe registered engineer. We provide these for landlords and letting agents.',
            },
            {
                q: 'What is an EICR?',
                a: 'An Electrical Installation Condition Report (EICR) is a formal inspection of your property\'s fixed wiring. It\'s required for rental properties every 5 years and recommended for all homes. Our NICEIC approved electricians carry these out.',
            },
            {
                q: 'Are your engineers Gas Safe registered?',
                a: 'Yes. Every engineer carrying out gas work is Gas Safe registered — it\'s a legal requirement. You can ask to see our Gas Safe ID card before any gas work begins.',
            },
            {
                q: 'Do you provide completion certificates for electrical work?',
                a: 'Yes. All notifiable electrical work comes with the relevant Building Regulations certificate or Minor Works Certificate, depending on the scope. Full documentation is provided on completion.',
            },
        ],
    },
];

export default function FaqSection() {
    const [open, setOpen] = useState<string | null>(null);

    const toggle = (key: string) => setOpen(prev => (prev === key ? null : key));

    return (
        <section className="faq_section">
            <div className="wrapper_general">
                <div className="faq_header">
                    <div className="faq_tag">FAQ</div>
                    <h2 className="h2 title_faq">Common <span className="highlight">Questions</span></h2>
                </div>
                <div className="faq_groups">
                    {GROUPS.map(group => (
                        <div key={group.label} className="faq_group">
                            <div className="faq_group_label">{group.label}</div>
                            <div className="faq_list">
                                {group.items.map((item, i) => {
                                    const key = `${group.label}-${i}`;
                                    const isOpen = open === key;
                                    return (
                                        <div key={key} className={`accordion-item${isOpen ? ' is-open' : ''}`}>
                                            <button
                                                className="faq_head"
                                                onClick={() => toggle(key)}
                                                aria-expanded={isOpen}
                                            >
                                                <span className="faq_q">{item.q}</span>
                                                <span className="faq_icon">{isOpen ? '−' : '+'}</span>
                                            </button>
                                            <div className="item_content-wrapper" aria-hidden={!isOpen}>
                                                <div className="faq_body base_p">{item.a}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

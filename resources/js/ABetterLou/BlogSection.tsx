const POSTS = [
    {
        img: '/images/WorcesterBoschGreenstarBoiler.webp',
        tag: 'Gas',
        date: 'June 2025',
        title: '5 Signs Your Boiler Needs Replacing',
        desc: 'An ageing boiler can cost you more in repairs than a replacement. Here\'s what to look out for before it lets you down.',
        href: '/contact',
    },
    {
        img: '/images/optimised/gas-boiler-vaillant-vmw-23cs-1-5-cf-ecotec-plus-removebg-preview.webp',
        tag: 'Landlords',
        date: 'May 2025',
        title: 'What is a CP12 Gas Safety Certificate?',
        desc: 'If you rent out a property, a gas safety check is a legal requirement. Here\'s everything you need to know about CP12 certificates.',
        href: '/contact',
    },
    {
        img: '/images/Logic_System_IE_Front_Facing.webp',
        tag: 'Electrical',
        date: 'April 2025',
        title: 'Do You Need an EICR? Everything Explained',
        desc: 'An Electrical Installation Condition Report is required for rental properties every 5 years. Find out what\'s involved and how to book.',
        href: '/contact',
    },
];

export default function BlogSection() {
    return (
        <section className="blog_section">
            <div className="wrapper_general">
                <div className="blog_header">
                    <div className="blog_tag">Tips &amp; Advice</div>
                    <h2 className="h2">Latest Insights</h2>
                </div>
                <div className="blog_grid">
                    {POSTS.map(post => (
                        <a
                            key={post.title}
                            href={post.href}
                            className="article_card"
                        >
                            <div className="cover_image">
                                <img
                                    src={post.img}
                                    alt={post.title}
                                    loading="lazy"
                                    className="image blog_img"
                                    style={{ objectFit: 'contain', background: '#f0ddc0' }}
                                />
                            </div>
                            <div className="card_body">
                                <div className="tags_blog">
                                    <div className="date_cat">{post.tag}</div>
                                    <div className="date_cat">{post.date}</div>
                                </div>
                                <div className="title_blog">{post.title}</div>
                                <div className="article_desc base_p">{post.desc}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

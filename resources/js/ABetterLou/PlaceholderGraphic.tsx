export type GraphicType =
    | 'plumbing' | 'gas' | 'electrical'
    | 'team' | 'engineer'
    | 'blog-gas' | 'blog-landlord' | 'blog-electrical'
    | 'cta' | 'fullscreen';

interface Props {
    type: GraphicType;
    style?: React.CSSProperties;
    className?: string;
}

/* ── clean stroke icons, centered on 400×300 canvas ── */

function FlameIcon() {
    return (
        <g fill="none" stroke="#ff6a00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
            {/* outer flame */}
            <path d="M200,85 C200,85 170,112 170,138 C170,161 183,176 200,176 C217,176 230,161 230,138 C230,112 200,85 200,85 Z" />
            {/* inner core */}
            <path d="M200,120 C200,120 188,133 188,144 C188,153 193,160 200,160 C207,160 212,153 212,144 C212,133 200,120 200,120 Z" />
        </g>
    );
}

function BoltIcon() {
    return (
        <polygon
            points="215,85 182,143 200,143 185,191 218,133 200,133"
            fill="none"
            stroke="#ff6a00"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.65"
        />
    );
}

function DropIcon() {
    return (
        <g fill="none" stroke="#ff6a00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
            <path d="M200,85 C200,85 168,120 168,145 C168,163 182,176 200,176 C218,176 232,163 232,145 C232,120 200,85 200,85 Z" />
            <line x1="186" y1="152" x2="186" y2="160" />
            <line x1="200" y1="156" x2="200" y2="164" />
            <line x1="214" y1="152" x2="214" y2="160" />
        </g>
    );
}

function HouseIcon() {
    return (
        <g fill="none" stroke="#ff6a00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
            {/* roof */}
            <polyline points="163,140 200,96 237,140" />
            {/* walls */}
            <rect x="174" y="139" width="52" height="42" />
            {/* door */}
            <rect x="190" y="156" width="20" height="25" rx="10" />
        </g>
    );
}

function TeamIcon() {
    return (
        <g fill="none" stroke="#ff6a00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
            {/* left person */}
            <circle cx="178" cy="116" r="13" />
            <path d="M155,176 Q155,147 178,147 Q201,147 201,176" />
            {/* right person */}
            <circle cx="222" cy="116" r="13" />
            <path d="M199,176 Q199,147 222,147 Q245,147 245,176" />
        </g>
    );
}

function EngineerIcon() {
    return (
        <g fill="none" stroke="#ff6a00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
            {/* head */}
            <circle cx="200" cy="120" r="20" />
            {/* hard hat brim */}
            <line x1="172" y1="108" x2="228" y2="108" />
            {/* hat top */}
            <path d="M180,108 Q180,92 200,92 Q220,92 220,108" />
            {/* body */}
            <path d="M166,176 Q166,148 200,148 Q234,148 234,176" />
        </g>
    );
}

function getIcon(type: GraphicType) {
    switch (type) {
        case 'gas': case 'cta': case 'fullscreen': case 'blog-gas':
            return <FlameIcon />;
        case 'electrical': case 'blog-electrical':
            return <BoltIcon />;
        case 'plumbing':
            return <DropIcon />;
        case 'blog-landlord':
            return <HouseIcon />;
        case 'team':
            return <TeamIcon />;
        case 'engineer':
        default:
            return <EngineerIcon />;
    }
}

function getLabel(type: GraphicType) {
    const labels: Record<GraphicType, string> = {
        plumbing:          'Plumbing',
        gas:               'Gas',
        electrical:        'Electrical',
        team:              'Our Team',
        engineer:          'Engineer',
        'blog-gas':        'Gas',
        'blog-landlord':   'Landlords',
        'blog-electrical': 'Electrical',
        cta:               'Heat Spark Energy Services',
        fullscreen:        'Heat Spark Energy Services',
    };
    return labels[type];
}

export default function PlaceholderGraphic({ type, style, className }: Props) {
    return (
        <div
            className={className}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
                background: '#111111',
                ...style,
            }}
        >
            <svg
                viewBox="0 0 400 300"
                preserveAspectRatio="xMidYMid slice"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                aria-hidden="true"
            >
                <rect width="400" height="300" fill="#111111" />

                {/* subtle inner border */}
                <rect x="12" y="12" width="376" height="276" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" rx="2" />

                {/* icon */}
                {getIcon(type)}

                {/* label */}
                <text
                    x="200" y="220"
                    textAnchor="middle"
                    fontFamily="'Times New Roman', Times, serif"
                    fontSize="10"
                    fill="rgba(255,255,255,0.2)"
                    letterSpacing="3"
                >
                    {getLabel(type).toUpperCase()}
                </text>
            </svg>
        </div>
    );
}

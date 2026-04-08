interface StageProps {
  className?: string;
  width?: number;
}

const PRIMARY = "#E31C5F";
const ACCENT = "#008489";
const SOFT = "#FFE4ED";

function Wrap({
  width = 280,
  className,
  children,
}: {
  width?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      width={width}
      height={width * 0.75}
      viewBox="0 0 280 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {children}
    </svg>
  );
}

// 1. Pesquisa — lupa + mapa
export function ResearchStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <rect width="280" height="210" rx="16" fill={SOFT} opacity="0.4" />
      {/* Map */}
      <rect x="60" y="55" width="160" height="110" rx="6" fill="white" stroke={ACCENT} strokeWidth="2" />
      <path d="M75 90 L110 75 L150 95 L190 80 L210 100 L195 130 L160 140 L120 130 L80 145Z" fill={ACCENT} opacity="0.2" />
      <circle cx="155" cy="105" r="6" fill={PRIMARY} />
      <path d="M155 105 L155 95 L162 100 Z" fill={PRIMARY} />
      {/* Magnifier */}
      <circle cx="175" cy="125" r="32" fill="white" stroke={PRIMARY} strokeWidth="5" />
      <line x1="198" y1="148" x2="220" y2="170" stroke={PRIMARY} strokeWidth="6" strokeLinecap="round" />
      <circle cx="175" cy="125" r="28" fill={PRIMARY} opacity="0.08" />
    </Wrap>
  );
}

// 2. Idiomas — livro + headphone + estrelas
export function LanguageStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <rect width="280" height="210" rx="16" fill={SOFT} opacity="0.4" />
      {/* Desk surface */}
      <rect x="20" y="155" width="240" height="6" rx="3" fill={ACCENT} opacity="0.25" />
      {/* Open book */}
      <g transform="translate(70, 90)">
        <path d="M0 60 Q35 50 70 60 L70 10 Q35 0 0 10 Z" fill="white" stroke={ACCENT} strokeWidth="2" />
        <path d="M70 60 Q105 50 140 60 L140 10 Q105 0 70 10 Z" fill="white" stroke={ACCENT} strokeWidth="2" />
        <line x1="70" y1="10" x2="70" y2="60" stroke={ACCENT} strokeWidth="2" />
        <line x1="15" y1="20" x2="60" y2="17" stroke={ACCENT} strokeWidth="1.5" opacity="0.4" />
        <line x1="15" y1="30" x2="60" y2="27" stroke={ACCENT} strokeWidth="1.5" opacity="0.4" />
        <line x1="15" y1="40" x2="55" y2="37" stroke={ACCENT} strokeWidth="1.5" opacity="0.4" />
        <line x1="80" y1="17" x2="125" y2="20" stroke={ACCENT} strokeWidth="1.5" opacity="0.4" />
        <line x1="80" y1="27" x2="125" y2="30" stroke={ACCENT} strokeWidth="1.5" opacity="0.4" />
        <line x1="80" y1="37" x2="120" y2="40" stroke={ACCENT} strokeWidth="1.5" opacity="0.4" />
      </g>
      {/* Headphones */}
      <g transform="translate(170, 40)">
        <path d="M0 30 Q0 0 30 0 Q60 0 60 30" stroke={PRIMARY} strokeWidth="4" fill="none" strokeLinecap="round" />
        <rect x="-6" y="28" width="14" height="22" rx="4" fill={PRIMARY} />
        <rect x="52" y="28" width="14" height="22" rx="4" fill={PRIMARY} />
      </g>
      {/* Speech bubble "A" */}
      <g transform="translate(40, 50)">
        <circle cx="20" cy="20" r="20" fill={PRIMARY} />
        <text x="20" y="27" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="system-ui">A</text>
      </g>
      {/* Stars */}
      <path d="M230 110 l3 6 l6 1 l-4 4 l1 6 l-6 -3 l-6 3 l1 -6 l-4 -4 l6 -1 z" fill={PRIMARY} opacity="0.7" />
      <path d="M250 75 l2 4 l5 1 l-3 3 l1 5 l-5 -2 l-5 2 l1 -5 l-3 -3 l5 -1 z" fill={PRIMARY} opacity="0.5" />
    </Wrap>
  );
}

// 3. ECA — diploma + carimbo
export function EcaStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <rect width="280" height="210" rx="16" fill={SOFT} opacity="0.4" />
      {/* Diploma */}
      <rect x="50" y="50" width="180" height="120" rx="6" fill="white" stroke={ACCENT} strokeWidth="2" />
      <line x1="70" y1="80" x2="210" y2="80" stroke={ACCENT} strokeWidth="2" />
      <line x1="70" y1="95" x2="180" y2="95" stroke={ACCENT} strokeWidth="1.5" opacity="0.4" />
      <line x1="70" y1="108" x2="200" y2="108" stroke={ACCENT} strokeWidth="1.5" opacity="0.4" />
      <line x1="70" y1="121" x2="170" y2="121" stroke={ACCENT} strokeWidth="1.5" opacity="0.4" />
      {/* Ribbon seal */}
      <circle cx="180" cy="145" r="16" fill={PRIMARY} />
      <path d="M170 158 L168 178 L180 170 L192 178 L190 158 Z" fill={PRIMARY} />
      <circle cx="180" cy="145" r="8" fill="white" opacity="0.4" />
      {/* Graduation cap */}
      <g transform="translate(95, 35)">
        <path d="M0 15 L25 5 L50 15 L25 25 Z" fill={PRIMARY} />
        <rect x="22" y="15" width="6" height="14" fill={PRIMARY} />
        <circle cx="48" cy="22" r="2" fill={PRIMARY} />
      </g>
    </Wrap>
  );
}

// 4. Submissão — laptop + envelope
export function SubmissionStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <rect width="280" height="210" rx="16" fill={SOFT} opacity="0.4" />
      {/* Laptop */}
      <rect x="60" y="80" width="160" height="100" rx="6" fill={ACCENT} />
      <rect x="68" y="88" width="144" height="84" rx="3" fill="white" />
      <rect x="40" y="180" width="200" height="6" rx="3" fill={ACCENT} />
      {/* Screen content */}
      <rect x="78" y="98" width="60" height="6" rx="2" fill={ACCENT} opacity="0.3" />
      <rect x="78" y="110" width="120" height="4" rx="2" fill={ACCENT} opacity="0.2" />
      <rect x="78" y="120" width="100" height="4" rx="2" fill={ACCENT} opacity="0.2" />
      <rect x="78" y="130" width="80" height="4" rx="2" fill={ACCENT} opacity="0.2" />
      <rect x="78" y="148" width="40" height="14" rx="3" fill={PRIMARY} />
      {/* Envelope flying out */}
      <g transform="translate(190, 30)">
        <rect x="0" y="0" width="50" height="34" rx="3" fill="white" stroke={PRIMARY} strokeWidth="2.5" />
        <path d="M0 0 L25 22 L50 0" stroke={PRIMARY} strokeWidth="2.5" fill="none" />
      </g>
      <path d="M180 70 Q200 60 215 50" stroke={PRIMARY} strokeWidth="2" strokeDasharray="4 3" fill="none" />
    </Wrap>
  );
}

// 5. Aprovação — envelope com selo + confete
export function ApprovalStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <rect width="280" height="210" rx="16" fill={SOFT} opacity="0.4" />
      {/* Envelope */}
      <g transform="translate(80, 70)">
        <rect x="0" y="10" width="120" height="80" rx="4" fill="white" stroke={ACCENT} strokeWidth="2.5" />
        <path d="M0 10 L60 55 L120 10" stroke={ACCENT} strokeWidth="2.5" fill="none" />
        {/* Wax seal */}
        <circle cx="60" cy="55" r="16" fill={PRIMARY} />
        <path d="M55 50 L60 58 L67 48" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      {/* Confetti */}
      <rect x="40" y="40" width="6" height="6" rx="1" fill={PRIMARY} transform="rotate(20 43 43)" />
      <rect x="220" y="50" width="6" height="6" rx="1" fill={ACCENT} transform="rotate(-15 223 53)" />
      <rect x="50" y="170" width="5" height="5" rx="1" fill={ACCENT} transform="rotate(30 52 172)" />
      <rect x="230" y="160" width="6" height="6" rx="1" fill={PRIMARY} transform="rotate(-25 233 163)" />
      <circle cx="30" cy="100" r="3" fill={PRIMARY} />
      <circle cx="250" cy="120" r="3" fill={ACCENT} />
      <circle cx="60" cy="190" r="3" fill={PRIMARY} />
      <circle cx="245" cy="35" r="3" fill={PRIMARY} />
    </Wrap>
  );
}

// 6. Visto — passaporte + carimbo
export function VisaStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <rect width="280" height="210" rx="16" fill={SOFT} opacity="0.4" />
      {/* Passport */}
      <g transform="translate(70, 50)">
        <rect x="0" y="0" width="110" height="140" rx="8" fill={PRIMARY} />
        <rect x="6" y="6" width="98" height="128" rx="5" fill="white" opacity="0.1" stroke="white" strokeWidth="1" />
        {/* Maple leaf */}
        <g transform="translate(40, 35)">
          <path d="M15 0 L18 8 L26 6 L21 13 L28 18 L20 18 L18 26 L15 20 L12 26 L10 18 L2 18 L9 13 L4 6 L12 8 Z" fill="white" />
        </g>
        <rect x="25" y="80" width="60" height="3" rx="1" fill="white" opacity="0.6" />
        <rect x="30" y="90" width="50" height="2" rx="1" fill="white" opacity="0.4" />
        <rect x="30" y="98" width="50" height="2" rx="1" fill="white" opacity="0.4" />
      </g>
      {/* Stamp */}
      <g transform="translate(170, 110) rotate(-12)">
        <circle cx="30" cy="30" r="32" fill="none" stroke={ACCENT} strokeWidth="3" />
        <circle cx="30" cy="30" r="24" fill="none" stroke={ACCENT} strokeWidth="1.5" />
        <text x="30" y="28" textAnchor="middle" fill={ACCENT} fontSize="9" fontWeight="bold" fontFamily="system-ui">APROVADO</text>
        <text x="30" y="40" textAnchor="middle" fill={ACCENT} fontSize="7" fontFamily="system-ui">CANADA</text>
      </g>
    </Wrap>
  );
}

// 7. Landing — avião pousando + maple
export function LandingStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <rect width="280" height="210" rx="16" fill={SOFT} opacity="0.4" />
      {/* Sky gradient hint */}
      <rect x="0" y="0" width="280" height="140" fill={ACCENT} opacity="0.05" />
      {/* Runway */}
      <path d="M40 175 L240 175" stroke={ACCENT} strokeWidth="3" />
      <line x1="60" y1="175" x2="80" y2="175" stroke="white" strokeWidth="2" />
      <line x1="100" y1="175" x2="120" y2="175" stroke="white" strokeWidth="2" />
      <line x1="140" y1="175" x2="160" y2="175" stroke="white" strokeWidth="2" />
      <line x1="180" y1="175" x2="200" y2="175" stroke="white" strokeWidth="2" />
      {/* Airplane landing */}
      <g transform="translate(110, 80) rotate(15)">
        <path d="M0 20 L60 12 L80 5 L88 10 L78 18 L95 22 L78 28 L88 36 L80 41 L60 32 L0 24 Z" fill={PRIMARY} />
        <path d="M30 24 L20 38 L28 38 L36 26 Z" fill={PRIMARY} opacity="0.7" />
      </g>
      {/* Trail */}
      <path d="M40 70 Q70 75 100 88" stroke={PRIMARY} strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.5" />
      {/* Maple leaf big */}
      <g transform="translate(210, 50)">
        <path d="M20 0 L24 12 L36 9 L29 19 L40 26 L28 26 L26 38 L20 28 L14 38 L12 26 L0 26 L11 19 L4 9 L16 12 Z" fill={PRIMARY} />
        <line x1="20" y1="28" x2="20" y2="48" stroke={PRIMARY} strokeWidth="2.5" />
      </g>
    </Wrap>
  );
}

// 8. PR — casa + chave
export function PrStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <rect width="280" height="210" rx="16" fill={SOFT} opacity="0.4" />
      {/* House */}
      <g transform="translate(70, 60)">
        {/* Roof */}
        <path d="M0 50 L70 0 L140 50 Z" fill={PRIMARY} />
        {/* Body */}
        <rect x="15" y="50" width="110" height="80" fill="white" stroke={ACCENT} strokeWidth="2.5" />
        {/* Door */}
        <rect x="55" y="80" width="30" height="50" fill={PRIMARY} />
        <circle cx="78" cy="105" r="2" fill="white" />
        {/* Windows */}
        <rect x="25" y="65" width="20" height="20" fill={ACCENT} opacity="0.2" stroke={ACCENT} strokeWidth="1.5" />
        <line x1="35" y1="65" x2="35" y2="85" stroke={ACCENT} strokeWidth="1" />
        <line x1="25" y1="75" x2="45" y2="75" stroke={ACCENT} strokeWidth="1" />
        <rect x="95" y="65" width="20" height="20" fill={ACCENT} opacity="0.2" stroke={ACCENT} strokeWidth="1.5" />
        <line x1="105" y1="65" x2="105" y2="85" stroke={ACCENT} strokeWidth="1" />
        <line x1="95" y1="75" x2="115" y2="75" stroke={ACCENT} strokeWidth="1" />
        {/* Chimney */}
        <rect x="100" y="15" width="14" height="20" fill={PRIMARY} opacity="0.7" />
      </g>
      {/* Key */}
      <g transform="translate(215, 130) rotate(30)">
        <circle cx="10" cy="10" r="10" fill="none" stroke={PRIMARY} strokeWidth="3" />
        <circle cx="10" cy="10" r="3" fill={PRIMARY} />
        <line x1="20" y1="10" x2="42" y2="10" stroke={PRIMARY} strokeWidth="3" strokeLinecap="round" />
        <line x1="35" y1="10" x2="35" y2="16" stroke={PRIMARY} strokeWidth="3" strokeLinecap="round" />
        <line x1="40" y1="10" x2="40" y2="16" stroke={PRIMARY} strokeWidth="3" strokeLinecap="round" />
      </g>
    </Wrap>
  );
}

// 9. Cidadania — bandeira + estrelas
export function CitizenshipStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <rect width="280" height="210" rx="16" fill={SOFT} opacity="0.4" />
      {/* Flag pole */}
      <line x1="80" y1="40" x2="80" y2="180" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" />
      <circle cx="80" cy="38" r="5" fill={PRIMARY} />
      {/* Flag */}
      <g transform="translate(80, 45)">
        <rect x="0" y="0" width="140" height="80" fill="white" stroke={ACCENT} strokeWidth="2" />
        <rect x="0" y="0" width="35" height="80" fill={PRIMARY} />
        <rect x="105" y="0" width="35" height="80" fill={PRIMARY} />
        {/* Maple leaf center */}
        <g transform="translate(58, 22)">
          <path d="M12 0 L15 8 L24 6 L18 14 L26 20 L18 20 L17 30 L12 22 L7 30 L6 20 L-2 20 L6 14 L0 6 L9 8 Z" fill={PRIMARY} />
        </g>
      </g>
      {/* Confetti */}
      <circle cx="40" cy="60" r="3" fill={PRIMARY} />
      <circle cx="240" cy="80" r="3" fill={PRIMARY} />
      <circle cx="50" cy="160" r="3" fill={ACCENT} />
      <circle cx="245" cy="170" r="3" fill={ACCENT} />
      <path d="M30 100 l2 4 l5 1 l-3 3 l1 5 l-5 -2 l-5 2 l1 -5 l-3 -3 l5 -1 z" fill={PRIMARY} opacity="0.6" />
      <path d="M250 130 l2 4 l5 1 l-3 3 l1 5 l-5 -2 l-5 2 l1 -5 l-3 -3 l5 -1 z" fill={PRIMARY} opacity="0.6" />
    </Wrap>
  );
}

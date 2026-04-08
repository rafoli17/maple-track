// ─────────────────────────────────────────────
// Stage illustrations — Airbnb-inspired style
// Soft pastel palette, rounded organic shapes,
// layered fills (no thin outlines), subtle depth.
// ─────────────────────────────────────────────

interface StageProps {
  className?: string;
  width?: number;
}

// Palette
const ROSE = "#FF5A5F";        // primary warm
const ROSE_DARK = "#E31C5F";
const ROSE_SOFT = "#FFC9D2";
const PEACH = "#FFB997";
const TEAL = "#00A699";
const TEAL_SOFT = "#B8E5E1";
const CREAM = "#FFF8F3";
const SAND = "#FFE5D4";
const NAVY = "#484848";
const GRAY_SOFT = "#EBE9E6";

function Wrap({
  width = 280,
  className,
  children,
  bg = CREAM,
}: {
  width?: number;
  className?: string;
  children: React.ReactNode;
  bg?: string;
}) {
  return (
    <svg
      width={width}
      height={width * 0.85}
      viewBox="0 0 280 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Soft rounded backdrop blob */}
      <ellipse cx="140" cy="130" rx="135" ry="100" fill={bg} />
      {children}
    </svg>
  );
}

// 1. Pesquisa — pessoa com lupa sobre mapa
export function ResearchStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      {/* Floor shadow */}
      <ellipse cx="140" cy="200" rx="90" ry="8" fill={NAVY} opacity="0.08" />
      {/* Map paper */}
      <g transform="rotate(-4 140 140)">
        <rect x="60" y="80" width="160" height="120" rx="14" fill="white" />
        <rect x="60" y="80" width="160" height="120" rx="14" fill={SAND} opacity="0.4" />
        {/* Map paths */}
        <path d="M75 130 Q105 110 135 125 T200 130" stroke={TEAL} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M85 165 Q120 150 160 165 T210 170" stroke={TEAL} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.4" />
        {/* Land blobs */}
        <ellipse cx="115" cy="115" rx="20" ry="10" fill={TEAL_SOFT} />
        <ellipse cx="170" cy="155" rx="22" ry="12" fill={TEAL_SOFT} />
      </g>
      {/* Pin */}
      <g transform="translate(160, 95)">
        <path d="M0 0 C0 -16 24 -16 24 0 C24 12 12 24 12 30 C12 24 0 12 0 0 Z" fill={ROSE} />
        <circle cx="12" cy="2" r="5" fill="white" />
      </g>
      {/* Magnifier */}
      <g transform="translate(150, 130)">
        <circle cx="40" cy="40" r="36" fill="white" />
        <circle cx="40" cy="40" r="36" fill={ROSE_SOFT} opacity="0.5" />
        <circle cx="40" cy="40" r="36" stroke={NAVY} strokeWidth="6" fill="none" />
        <circle cx="32" cy="32" r="10" fill="white" opacity="0.7" />
        <rect x="64" y="64" width="34" height="12" rx="6" fill={NAVY} transform="rotate(45 64 64)" />
      </g>
    </Wrap>
  );
}

// 2. Idiomas — livro aberto + balão de fala + nota musical
export function LanguageStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <ellipse cx="140" cy="205" rx="100" ry="10" fill={NAVY} opacity="0.08" />
      {/* Book base shadow */}
      <ellipse cx="140" cy="180" rx="85" ry="12" fill={NAVY} opacity="0.06" />
      {/* Book — open */}
      <g transform="translate(45, 110)">
        <path d="M0 60 Q45 45 95 60 L95 10 Q45 -5 0 10 Z" fill={ROSE} />
        <path d="M95 60 Q145 45 190 60 L190 10 Q145 -5 95 10 Z" fill={ROSE_DARK} />
        {/* Pages */}
        <path d="M8 55 Q45 42 90 55 L90 14 Q45 1 8 14 Z" fill="white" />
        <path d="M100 55 Q140 42 182 55 L182 14 Q140 1 100 14 Z" fill="white" />
        {/* Lines */}
        <rect x="20" y="20" width="55" height="3" rx="1.5" fill={TEAL_SOFT} />
        <rect x="20" y="28" width="50" height="3" rx="1.5" fill={TEAL_SOFT} />
        <rect x="20" y="36" width="45" height="3" rx="1.5" fill={TEAL_SOFT} />
        <rect x="110" y="20" width="55" height="3" rx="1.5" fill={TEAL_SOFT} />
        <rect x="110" y="28" width="50" height="3" rx="1.5" fill={TEAL_SOFT} />
        <rect x="110" y="36" width="45" height="3" rx="1.5" fill={TEAL_SOFT} />
      </g>
      {/* Speech bubble with A */}
      <g transform="translate(30, 50)">
        <path d="M0 18 C0 4 14 -4 26 0 C40 -4 54 4 54 18 C54 32 40 38 26 36 L18 44 L20 34 C8 32 0 28 0 18 Z" fill={ROSE} />
        <text x="27" y="26" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="system-ui, sans-serif">A</text>
      </g>
      {/* Speech bubble with 中 */}
      <g transform="translate(190, 40)">
        <path d="M0 18 C0 4 14 -4 26 0 C40 -4 54 4 54 18 C54 32 40 38 26 36 L34 44 L32 34 C44 32 54 28 54 18 Z" fill={TEAL} />
        <text x="27" y="26" textAnchor="middle" fill="white" fontSize="20" fontWeight="800" fontFamily="system-ui, sans-serif">中</text>
      </g>
      {/* Sparkle */}
      <circle cx="240" cy="120" r="4" fill={PEACH} />
      <circle cx="35" cy="140" r="3" fill={ROSE_SOFT} />
    </Wrap>
  );
}

// 3. ECA — diploma com fita
export function EcaStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <ellipse cx="140" cy="205" rx="95" ry="10" fill={NAVY} opacity="0.08" />
      {/* Mortarboard */}
      <g transform="translate(85, 35)">
        <ellipse cx="55" cy="30" rx="60" ry="14" fill={NAVY} />
        <path d="M0 25 L55 5 L110 25 L55 45 Z" fill={NAVY} />
        <circle cx="55" cy="25" r="4" fill={ROSE} />
        <path d="M55 25 Q72 30 70 50 L66 48 L62 52 L60 48" stroke={ROSE} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      {/* Diploma scroll */}
      <g transform="translate(60, 100)">
        {/* Roll body */}
        <rect x="10" y="20" width="160" height="70" rx="6" fill="white" />
        <rect x="10" y="20" width="160" height="70" rx="6" fill={SAND} opacity="0.3" />
        {/* Lines */}
        <rect x="30" y="35" width="100" height="4" rx="2" fill={NAVY} opacity="0.15" />
        <rect x="30" y="48" width="120" height="4" rx="2" fill={NAVY} opacity="0.15" />
        <rect x="30" y="61" width="80" height="4" rx="2" fill={NAVY} opacity="0.15" />
        {/* Roll caps */}
        <ellipse cx="10" cy="55" rx="10" ry="35" fill={ROSE} />
        <ellipse cx="170" cy="55" rx="10" ry="35" fill={ROSE} />
        <ellipse cx="10" cy="55" rx="6" ry="32" fill={ROSE_DARK} />
        <ellipse cx="170" cy="55" rx="6" ry="32" fill={ROSE_DARK} />
      </g>
      {/* Ribbon medal */}
      <g transform="translate(180, 130)">
        <path d="M0 0 L8 30 L18 22 L28 30 L20 0 Z" fill={ROSE} />
        <circle cx="14" cy="-5" r="20" fill={PEACH} />
        <circle cx="14" cy="-5" r="14" fill={ROSE} />
        <text x="14" y="0" textAnchor="middle" fill="white" fontSize="14" fontWeight="800">★</text>
      </g>
    </Wrap>
  );
}

// 4. Submissão — laptop com upload
export function SubmissionStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <ellipse cx="140" cy="210" rx="110" ry="10" fill={NAVY} opacity="0.08" />
      {/* Laptop base */}
      <path d="M40 195 L240 195 L250 210 L30 210 Z" fill={NAVY} />
      <ellipse cx="140" cy="210" rx="110" ry="3" fill="black" opacity="0.2" />
      {/* Laptop screen */}
      <rect x="55" y="80" width="170" height="115" rx="10" fill={NAVY} />
      <rect x="62" y="87" width="156" height="100" rx="6" fill="white" />
      <rect x="62" y="87" width="156" height="100" rx="6" fill={ROSE_SOFT} opacity="0.3" />
      {/* Window header */}
      <rect x="62" y="87" width="156" height="16" fill={ROSE} />
      <circle cx="72" cy="95" r="2.5" fill="white" />
      <circle cx="80" cy="95" r="2.5" fill="white" />
      <circle cx="88" cy="95" r="2.5" fill="white" />
      {/* Upload arrow inside */}
      <g transform="translate(125, 120)">
        <circle cx="15" cy="22" r="22" fill={TEAL_SOFT} />
        <path d="M15 8 L15 32 M5 18 L15 8 L25 18" stroke={TEAL} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <rect x="80" y="170" width="120" height="6" rx="3" fill={NAVY} opacity="0.15" />
      {/* Floating envelope */}
      <g transform="translate(190, 35)">
        <rect x="0" y="0" width="50" height="36" rx="5" fill={ROSE} />
        <path d="M0 5 L25 25 L50 5" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* Sparkle dots */}
      <circle cx="40" cy="60" r="3" fill={PEACH} />
      <circle cx="245" cy="90" r="3" fill={ROSE_SOFT} />
    </Wrap>
  );
}

// 5. Aprovação — envelope aberto + estrelas/confete
export function ApprovalStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <ellipse cx="140" cy="210" rx="100" ry="10" fill={NAVY} opacity="0.08" />
      {/* Envelope back */}
      <g transform="translate(60, 95)">
        <rect x="0" y="20" width="160" height="100" rx="8" fill={ROSE} />
        {/* Letter peeking */}
        <rect x="15" y="5" width="130" height="80" rx="4" fill="white" />
        <rect x="28" y="20" width="80" height="4" rx="2" fill={NAVY} opacity="0.2" />
        <rect x="28" y="32" width="100" height="4" rx="2" fill={NAVY} opacity="0.2" />
        <rect x="28" y="44" width="60" height="4" rx="2" fill={NAVY} opacity="0.2" />
        {/* Check badge on letter */}
        <circle cx="115" cy="60" r="14" fill={TEAL} />
        <path d="M108 60 L113 65 L122 55" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Envelope flap */}
        <path d="M0 20 L80 -20 L160 20 L80 40 Z" fill={ROSE_DARK} />
      </g>
      {/* Confetti */}
      <rect x="30" y="70" width="8" height="8" rx="2" fill={PEACH} transform="rotate(20 34 74)" />
      <rect x="240" y="80" width="8" height="8" rx="2" fill={TEAL_SOFT} transform="rotate(-15 244 84)" />
      <circle cx="35" cy="170" r="4" fill={ROSE} />
      <circle cx="245" cy="160" r="4" fill={TEAL} />
      <path d="M255 50 l3 6 l6 1 l-4 4 l1 6 l-6 -3 l-6 3 l1 -6 l-4 -4 l6 -1 z" fill={PEACH} />
      <path d="M20 110 l3 6 l6 1 l-4 4 l1 6 l-6 -3 l-6 3 l1 -6 l-4 -4 l6 -1 z" fill={ROSE_SOFT} />
    </Wrap>
  );
}

// 6. Visto — passaporte + maple
export function VisaStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <ellipse cx="140" cy="210" rx="95" ry="10" fill={NAVY} opacity="0.08" />
      {/* Passport stack shadow */}
      <rect x="78" y="62" width="124" height="148" rx="14" fill={ROSE_DARK} />
      {/* Passport */}
      <g transform="translate(70, 50)">
        <rect x="0" y="0" width="140" height="160" rx="14" fill={ROSE} />
        <rect x="8" y="8" width="124" height="144" rx="10" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
        {/* Maple leaf big */}
        <g transform="translate(50, 38)">
          <path d="M20 0 L24 14 L38 10 L30 22 L42 30 L28 30 L26 44 L20 32 L14 44 L12 30 L-2 30 L10 22 L2 10 L16 14 Z" fill="white" />
        </g>
        {/* Title */}
        <rect x="35" y="98" width="70" height="6" rx="3" fill="white" opacity="0.8" />
        <rect x="45" y="112" width="50" height="4" rx="2" fill="white" opacity="0.6" />
        <rect x="40" y="122" width="60" height="4" rx="2" fill="white" opacity="0.6" />
      </g>
      {/* Plane sticker */}
      <g transform="translate(195, 75) rotate(-20)">
        <circle cx="20" cy="20" r="22" fill={TEAL} />
        <path d="M8 22 L28 14 L34 10 L36 14 L32 18 L36 22 L32 26 L36 30 L34 34 L28 30 L8 22 Z" fill="white" />
      </g>
    </Wrap>
  );
}

// 7. Landing — avião pousando com nuvens
export function LandingStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      {/* Sky */}
      <ellipse cx="140" cy="115" rx="135" ry="80" fill={TEAL_SOFT} opacity="0.4" />
      {/* Clouds */}
      <g fill="white">
        <ellipse cx="55" cy="75" rx="22" ry="10" />
        <ellipse cx="68" cy="70" rx="14" ry="8" />
      </g>
      <g fill="white">
        <ellipse cx="220" cy="95" rx="20" ry="9" />
        <ellipse cx="232" cy="90" rx="13" ry="7" />
      </g>
      <g fill="white" opacity="0.7">
        <ellipse cx="40" cy="140" rx="16" ry="7" />
      </g>
      {/* Sun */}
      <circle cx="235" cy="55" r="20" fill={PEACH} />
      <circle cx="235" cy="55" r="14" fill={ROSE_SOFT} />
      {/* Ground */}
      <ellipse cx="140" cy="220" rx="140" ry="20" fill={SAND} />
      <ellipse cx="140" cy="220" rx="140" ry="20" fill={ROSE_SOFT} opacity="0.4" />
      {/* Runway */}
      <path d="M50 215 L230 195 L240 205 L60 225 Z" fill={NAVY} opacity="0.7" />
      <line x1="80" y1="212" x2="100" y2="210" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="120" y1="208" x2="140" y2="206" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="160" y1="204" x2="180" y2="202" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="200" y1="200" x2="215" y2="198" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Plane */}
      <g transform="translate(110, 100) rotate(12)">
        <path d="M0 24 C0 18 8 14 18 14 L72 6 C82 4 94 0 102 4 C108 7 104 16 96 18 L88 22 L100 30 L92 32 L78 28 L20 32 C8 32 0 30 0 24 Z" fill={ROSE} />
        <path d="M30 26 L22 38 L32 38 L40 28 Z" fill={ROSE_DARK} />
        <circle cx="55" cy="20" r="3" fill="white" />
        <circle cx="65" cy="19" r="3" fill="white" />
      </g>
      {/* Maple */}
      <g transform="translate(20, 165)">
        <path d="M14 0 L17 9 L26 7 L21 15 L28 20 L20 20 L19 30 L14 22 L9 30 L8 20 L0 20 L7 15 L2 7 L11 9 Z" fill={ROSE} />
      </g>
    </Wrap>
  );
}

// 8. PR — casa fofa
export function PrStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <ellipse cx="140" cy="215" rx="115" ry="10" fill={NAVY} opacity="0.08" />
      {/* Background hill */}
      <ellipse cx="140" cy="220" rx="140" ry="35" fill={TEAL_SOFT} opacity="0.5" />
      {/* Tree left */}
      <g transform="translate(35, 130)">
        <rect x="10" y="60" width="6" height="30" rx="2" fill={NAVY} opacity="0.6" />
        <circle cx="13" cy="50" r="22" fill={TEAL} />
        <circle cx="13" cy="50" r="22" fill={TEAL_SOFT} opacity="0.4" />
      </g>
      {/* Tree right */}
      <g transform="translate(225, 140)">
        <rect x="10" y="50" width="6" height="28" rx="2" fill={NAVY} opacity="0.6" />
        <circle cx="13" cy="42" r="18" fill={TEAL} />
      </g>
      {/* House */}
      <g transform="translate(75, 70)">
        {/* Chimney */}
        <rect x="98" y="0" width="16" height="32" rx="2" fill={ROSE_DARK} />
        <rect x="96" y="-4" width="20" height="8" rx="2" fill={ROSE_DARK} />
        {/* Roof */}
        <path d="M-10 60 L65 5 L140 60 Z" fill={ROSE} />
        <path d="M-10 60 L65 5 L65 30 Z" fill={ROSE_DARK} />
        {/* Body */}
        <rect x="10" y="60" width="110" height="80" rx="4" fill="white" />
        <rect x="10" y="60" width="110" height="80" rx="4" fill={SAND} opacity="0.5" />
        {/* Door */}
        <path d="M50 140 L50 95 Q50 88 58 88 L72 88 Q80 88 80 95 L80 140 Z" fill={ROSE_DARK} />
        <circle cx="73" cy="115" r="2.5" fill={PEACH} />
        {/* Windows */}
        <rect x="20" y="78" width="22" height="22" rx="3" fill={TEAL_SOFT} />
        <rect x="20" y="78" width="22" height="22" rx="3" fill="none" stroke={NAVY} strokeWidth="2" opacity="0.4" />
        <line x1="31" y1="78" x2="31" y2="100" stroke={NAVY} strokeWidth="1.5" opacity="0.4" />
        <line x1="20" y1="89" x2="42" y2="89" stroke={NAVY} strokeWidth="1.5" opacity="0.4" />
        <rect x="88" y="78" width="22" height="22" rx="3" fill={TEAL_SOFT} />
        <rect x="88" y="78" width="22" height="22" rx="3" fill="none" stroke={NAVY} strokeWidth="2" opacity="0.4" />
        <line x1="99" y1="78" x2="99" y2="100" stroke={NAVY} strokeWidth="1.5" opacity="0.4" />
        <line x1="88" y1="89" x2="110" y2="89" stroke={NAVY} strokeWidth="1.5" opacity="0.4" />
      </g>
      {/* Smoke from chimney */}
      <g fill="white" opacity="0.85">
        <circle cx="183" cy="60" r="7" />
        <circle cx="190" cy="50" r="5" />
        <circle cx="195" cy="42" r="4" />
      </g>
    </Wrap>
  );
}

// 9. Cidadania — bandeira do canada hasteada com confete
export function CitizenshipStageIllustration(props: StageProps) {
  return (
    <Wrap {...props}>
      <ellipse cx="140" cy="215" rx="100" ry="10" fill={NAVY} opacity="0.08" />
      {/* Pole */}
      <rect x="68" y="40" width="6" height="170" rx="3" fill={NAVY} />
      <circle cx="71" cy="38" r="6" fill={PEACH} />
      {/* Flag waving */}
      <g transform="translate(74, 50)">
        <path d="M0 0 Q40 -8 80 4 Q120 12 160 4 L160 90 Q120 98 80 90 Q40 82 0 90 Z" fill="white" />
        {/* Left red */}
        <path d="M0 0 Q15 -3 30 0 L30 90 Q15 92 0 90 Z" fill={ROSE} />
        {/* Right red */}
        <path d="M130 4 Q145 7 160 4 L160 90 Q145 92 130 90 Z" fill={ROSE} />
        {/* Maple */}
        <g transform="translate(58, 28)">
          <path d="M22 0 L26 14 L40 11 L32 22 L44 30 L30 30 L28 44 L22 32 L16 44 L14 30 L0 30 L12 22 L4 11 L18 14 Z" fill={ROSE} />
        </g>
      </g>
      {/* Confetti */}
      <circle cx="35" cy="60" r="4" fill={PEACH} />
      <circle cx="245" cy="80" r="4" fill={TEAL} />
      <rect x="40" y="160" width="8" height="8" rx="2" fill={ROSE_SOFT} transform="rotate(15 44 164)" />
      <rect x="240" y="170" width="8" height="8" rx="2" fill={PEACH} transform="rotate(-20 244 174)" />
      <path d="M255 120 l3 6 l6 1 l-4 4 l1 6 l-6 -3 l-6 3 l1 -6 l-4 -4 l6 -1 z" fill={ROSE} />
      <path d="M25 130 l3 6 l6 1 l-4 4 l1 6 l-6 -3 l-6 3 l1 -6 l-4 -4 l6 -1 z" fill={TEAL_SOFT} />
    </Wrap>
  );
}

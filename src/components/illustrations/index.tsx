interface IllustrationProps {
  className?: string;
  width?: number;
}

export function HeroIllustration({ className, width = 280 }: IllustrationProps) {
  return (
    <svg
      width={width}
      height={width * 0.75}
      viewBox="0 0 280 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sky background */}
      <rect width="280" height="210" rx="16" fill="#F7F7F7" />

      {/* Mountains */}
      <path d="M0 180 L60 90 L100 140 L140 70 L180 130 L220 85 L280 180Z" fill="#008489" opacity="0.15" />
      <path d="M0 180 L80 110 L120 150 L170 95 L210 140 L280 180Z" fill="#008489" opacity="0.25" />

      {/* Snow caps */}
      <path d="M140 70 L130 90 L150 90Z" fill="white" opacity="0.8" />
      <path d="M220 85 L212 100 L228 100Z" fill="white" opacity="0.8" />

      {/* Road/path */}
      <path
        d="M140 210 Q140 180 145 165 Q150 150 155 140 Q165 120 180 110 Q200 95 230 90"
        stroke="#E31C5F"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 5"
        fill="none"
      />

      {/* Maple leaf */}
      <g transform="translate(50, 40) scale(0.7)">
        <path
          d="M25 0 L28 10 L38 8 L32 16 L40 22 L30 22 L28 32 L25 24 L22 32 L20 22 L10 22 L18 16 L12 8 L22 10Z"
          fill="#E31C5F"
        />
        <line x1="25" y1="24" x2="25" y2="38" stroke="#E31C5F" strokeWidth="2" />
      </g>

      {/* Airplane */}
      <g transform="translate(190, 35) rotate(-15)">
        <path d="M0 8 L25 4 L30 0 L32 3 L28 6 L35 8 L28 10 L32 13 L30 16 L25 12 L0 8Z" fill="#008489" />
      </g>

      {/* Airplane trail */}
      <path
        d="M160 55 Q175 48 190 43"
        stroke="#008489"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        fill="none"
        opacity="0.5"
      />

      {/* Sun */}
      <circle cx="240" cy="35" r="18" fill="#E31C5F" opacity="0.15" />
      <circle cx="240" cy="35" r="10" fill="#E31C5F" opacity="0.25" />

      {/* Small clouds */}
      <g opacity="0.3">
        <ellipse cx="70" cy="60" rx="20" ry="8" fill="white" />
        <ellipse cx="82" cy="55" rx="14" ry="7" fill="white" />
      </g>
      <g opacity="0.2">
        <ellipse cx="160" cy="30" rx="16" ry="6" fill="white" />
        <ellipse cx="170" cy="26" rx="12" ry="5" fill="white" />
      </g>

      {/* Ground line */}
      <path d="M0 180 L280 180" stroke="#008489" strokeWidth="1" opacity="0.2" />

      {/* Trees */}
      <g opacity="0.4">
        <polygon points="30,180 35,155 40,180" fill="#008489" />
        <polygon points="250,180 255,160 260,180" fill="#008489" />
        <polygon points="95,180 100,162 105,180" fill="#008489" />
      </g>
    </svg>
  );
}

export function EmptyStateIllustration({ className, width = 160 }: IllustrationProps) {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Box/folder */}
      <rect x="40" y="55" width="80" height="60" rx="8" fill="#F7F7F7" stroke="#E31C5F" strokeWidth="2" opacity="0.6" />
      <path d="M40 55 L40 50 Q40 42 48 42 L72 42 L78 50 L112 50 Q120 50 120 55" fill="#F7F7F7" stroke="#E31C5F" strokeWidth="2" opacity="0.6" />

      {/* Folder flap */}
      <path d="M45 55 L115 55" stroke="#E31C5F" strokeWidth="1" opacity="0.3" />

      {/* Subtle face - two dots and a curved line */}
      <circle cx="68" cy="82" r="2.5" fill="#008489" opacity="0.5" />
      <circle cx="92" cy="82" r="2.5" fill="#008489" opacity="0.5" />
      <path d="M72 95 Q80 100 88 95" stroke="#008489" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* Sparkles */}
      <g fill="#E31C5F" opacity="0.6">
        {/* Top-right sparkle */}
        <path d="M130 35 L132 40 L137 42 L132 44 L130 49 L128 44 L123 42 L128 40Z" />
        {/* Top-left sparkle */}
        <path d="M35 30 L36.5 34 L40.5 35.5 L36.5 37 L35 41 L33.5 37 L29.5 35.5 L33.5 34Z" />
        {/* Bottom-right sparkle */}
        <path d="M135 105 L136 108 L139 109 L136 110 L135 113 L134 110 L131 109 L134 108Z" />
      </g>

      {/* Small dots decoration */}
      <circle cx="50" cy="130" r="1.5" fill="#008489" opacity="0.3" />
      <circle cx="80" cy="135" r="1" fill="#E31C5F" opacity="0.3" />
      <circle cx="110" cy="128" r="1.5" fill="#008489" opacity="0.3" />
    </svg>
  );
}

export function OnboardingWelcomeIllustration({ className, width = 220 }: IllustrationProps) {
  return (
    <svg
      width={width}
      height={width * 0.85}
      viewBox="0 0 220 187"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Compass base circle */}
      <circle cx="110" cy="93" r="70" fill="#F7F7F7" stroke="#008489" strokeWidth="2" />
      <circle cx="110" cy="93" r="60" fill="white" stroke="#008489" strokeWidth="1" opacity="0.5" />

      {/* Compass cardinal directions */}
      <text x="110" y="42" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#E31C5F">N</text>
      <text x="110" y="155" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#008489" opacity="0.5">S</text>
      <text x="170" y="97" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#008489" opacity="0.5">E</text>
      <text x="50" y="97" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#008489" opacity="0.5">W</text>

      {/* Tick marks */}
      <line x1="110" y1="45" x2="110" y2="50" stroke="#008489" strokeWidth="1.5" />
      <line x1="110" y1="136" x2="110" y2="141" stroke="#008489" strokeWidth="1" opacity="0.5" />
      <line x1="45" y1="93" x2="50" y2="93" stroke="#008489" strokeWidth="1" opacity="0.5" />
      <line x1="170" y1="93" x2="175" y2="93" stroke="#008489" strokeWidth="1" opacity="0.5" />

      {/* Compass needle - North (coral) */}
      <polygon points="110,55 105,93 115,93" fill="#E31C5F" />
      {/* Compass needle - South (teal) */}
      <polygon points="110,131 105,93 115,93" fill="#008489" opacity="0.4" />

      {/* Center dot */}
      <circle cx="110" cy="93" r="5" fill="white" stroke="#222222" strokeWidth="2" />

      {/* Map pin */}
      <g transform="translate(155, 25)">
        <path
          d="M15 0 C22 0 28 6 28 13 C28 24 15 35 15 35 C15 35 2 24 2 13 C2 6 8 0 15 0Z"
          fill="#E31C5F"
          opacity="0.8"
        />
        <circle cx="15" cy="13" r="5" fill="white" />
      </g>

      {/* Dotted arc path */}
      <path
        d="M70 160 Q30 130 40 90 Q50 50 90 40"
        stroke="#E31C5F"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        fill="none"
        opacity="0.4"
      />

      {/* Small maple leaf accent */}
      <g transform="translate(25, 55) scale(0.4)">
        <path
          d="M25 0 L28 10 L38 8 L32 16 L40 22 L30 22 L28 32 L25 24 L22 32 L20 22 L10 22 L18 16 L12 8 L22 10Z"
          fill="#E31C5F"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}

export function DocumentsIllustration({ className, width = 200 }: IllustrationProps) {
  return (
    <svg
      width={width}
      height={width * 0.85}
      viewBox="0 0 200 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Back document */}
      <rect x="55" y="20" width="100" height="130" rx="8" fill="#F7F7F7" stroke="#008489" strokeWidth="1.5" opacity="0.5" transform="rotate(3 105 85)" />

      {/* Middle document */}
      <rect x="50" y="25" width="100" height="130" rx="8" fill="white" stroke="#008489" strokeWidth="1.5" opacity="0.7" transform="rotate(-2 100 90)" />

      {/* Front document */}
      <rect x="45" y="30" width="100" height="130" rx="8" fill="white" stroke="#222222" strokeWidth="1.5" opacity="0.8" />

      {/* Document lines */}
      <line x1="60" y1="55" x2="130" y2="55" stroke="#F7F7F7" strokeWidth="6" strokeLinecap="round" />
      <line x1="60" y1="70" x2="120" y2="70" stroke="#F7F7F7" strokeWidth="6" strokeLinecap="round" />
      <line x1="60" y1="85" x2="125" y2="85" stroke="#F7F7F7" strokeWidth="6" strokeLinecap="round" />
      <line x1="60" y1="100" x2="110" y2="100" stroke="#F7F7F7" strokeWidth="6" strokeLinecap="round" />

      {/* Checkmark circle */}
      <circle cx="140" cy="130" r="22" fill="#008489" />
      <path d="M130 130 L137 137 L152 122" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Corner fold on front doc */}
      <path d="M125 30 L145 30 L145 50Z" fill="#F7F7F7" stroke="#222222" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

export function JourneyIllustration({ className, width = 240 }: IllustrationProps) {
  return (
    <svg
      width={width}
      height={width * 0.65}
      viewBox="0 0 240 156"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Winding path */}
      <path
        d="M20 140 Q60 140 80 110 Q100 80 130 80 Q160 80 170 110 Q180 140 220 100"
        stroke="#E31C5F"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M20 140 Q60 140 80 110 Q100 80 130 80 Q160 80 170 110 Q180 140 220 100"
        stroke="#E31C5F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="8 6"
        fill="none"
      />

      {/* Milestone 1 */}
      <circle cx="20" cy="140" r="8" fill="#008489" />
      <circle cx="20" cy="140" r="4" fill="white" />

      {/* Milestone 2 */}
      <circle cx="80" cy="110" r="8" fill="#008489" />
      <circle cx="80" cy="110" r="4" fill="white" />

      {/* Milestone 3 */}
      <circle cx="130" cy="80" r="8" fill="#E31C5F" />
      <circle cx="130" cy="80" r="4" fill="white" />

      {/* Flag at milestone 3 */}
      <line x1="130" y1="80" x2="130" y2="50" stroke="#E31C5F" strokeWidth="2" />
      <path d="M130 50 L155 57 L130 64Z" fill="#E31C5F" opacity="0.7" />

      {/* Milestone 4 */}
      <circle cx="170" cy="110" r="8" fill="#008489" opacity="0.5" />
      <circle cx="170" cy="110" r="4" fill="white" />

      {/* Destination star */}
      <g transform="translate(220, 100)">
        <path d="M0 -12 L3 -4 L12 -4 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-12 -4 L-3 -4Z" fill="#E31C5F" opacity="0.8" />
      </g>

      {/* Labels */}
      <text x="12" y="158" fontSize="8" fill="#222222" opacity="0.5">Inicio</text>
      <text x="210" y="88" fontSize="8" fill="#222222" opacity="0.5">Meta</text>

      {/* Decorative dots along path */}
      <circle cx="50" cy="128" r="2" fill="#008489" opacity="0.3" />
      <circle cx="105" cy="82" r="2" fill="#008489" opacity="0.3" />
      <circle cx="150" cy="92" r="2" fill="#E31C5F" opacity="0.3" />
      <circle cx="195" cy="108" r="2" fill="#008489" opacity="0.3" />
    </svg>
  );
}

export function CelebrationIllustration({ className, width = 200 }: IllustrationProps) {
  return (
    <svg
      width={width}
      height={width * 0.85}
      viewBox="0 0 200 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Trophy */}
      <g transform="translate(60, 50)">
        {/* Cup body */}
        <path d="M20 0 L60 0 L55 45 Q40 60 25 45Z" fill="#E31C5F" opacity="0.2" stroke="#E31C5F" strokeWidth="2" />
        {/* Handles */}
        <path d="M20 10 Q5 10 5 25 Q5 38 20 38" stroke="#E31C5F" strokeWidth="2" fill="none" />
        <path d="M60 10 Q75 10 75 25 Q75 38 60 38" stroke="#E31C5F" strokeWidth="2" fill="none" />
        {/* Base */}
        <rect x="30" y="58" width="20" height="6" rx="2" fill="#E31C5F" opacity="0.5" />
        <rect x="25" y="64" width="30" height="5" rx="2" fill="#E31C5F" opacity="0.3" />
        {/* Star on trophy */}
        <path d="M40 18 L42 26 L50 26 L44 31 L46 39 L40 34 L34 39 L36 31 L30 26 L38 26Z" fill="#E31C5F" opacity="0.6" />
      </g>

      {/* Confetti pieces */}
      <rect x="30" y="20" width="8" height="4" rx="2" fill="#E31C5F" opacity="0.6" transform="rotate(-30 34 22)" />
      <rect x="160" y="30" width="8" height="4" rx="2" fill="#008489" opacity="0.6" transform="rotate(20 164 32)" />
      <rect x="45" y="45" width="6" height="3" rx="1.5" fill="#008489" opacity="0.5" transform="rotate(-15 48 46)" />
      <rect x="145" y="55" width="6" height="3" rx="1.5" fill="#E31C5F" opacity="0.5" transform="rotate(35 148 56)" />

      {/* Stars */}
      <g fill="#E31C5F" opacity="0.5">
        <path d="M25 60 L27 66 L33 66 L28 70 L30 76 L25 72 L20 76 L22 70 L17 66 L23 66Z" transform="scale(0.6) translate(15 -20)" />
        <path d="M170 40 L172 46 L178 46 L173 50 L175 56 L170 52 L165 56 L167 50 L162 46 L168 46Z" transform="scale(0.5)" />
      </g>

      {/* Sparkle bursts */}
      <circle cx="40" cy="35" r="2" fill="#008489" opacity="0.4" />
      <circle cx="165" cy="45" r="2.5" fill="#E31C5F" opacity="0.4" />
      <circle cx="50" cy="90" r="1.5" fill="#E31C5F" opacity="0.3" />
      <circle cx="150" cy="85" r="2" fill="#008489" opacity="0.3" />

      {/* Streaming ribbons */}
      <path d="M70 15 Q75 25 70 35" stroke="#008489" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M130 10 Q125 22 130 32" stroke="#E31C5F" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M100 5 Q105 18 100 28" stroke="#008489" strokeWidth="1.5" fill="none" opacity="0.3" />

      {/* Bottom decorative dots */}
      <circle cx="75" cy="145" r="2" fill="#E31C5F" opacity="0.2" />
      <circle cx="100" cy="150" r="1.5" fill="#008489" opacity="0.2" />
      <circle cx="125" cy="145" r="2" fill="#E31C5F" opacity="0.2" />
    </svg>
  );
}

export function FamilyIllustration({ className, width = 200 }: IllustrationProps) {
  return (
    <svg
      width={width}
      height={width * 0.65}
      viewBox="0 0 200 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Person 1 (left) */}
      <circle cx="72" cy="45" r="16" fill="#E31C5F" opacity="0.15" stroke="#E31C5F" strokeWidth="2" />
      <circle cx="72" cy="45" r="8" fill="#E31C5F" opacity="0.3" />
      <path d="M52 95 Q52 68 72 68 Q92 68 92 95" fill="#E31C5F" opacity="0.15" stroke="#E31C5F" strokeWidth="2" />

      {/* Person 2 (right) */}
      <circle cx="128" cy="45" r="16" fill="#008489" opacity="0.15" stroke="#008489" strokeWidth="2" />
      <circle cx="128" cy="45" r="8" fill="#008489" opacity="0.3" />
      <path d="M108 95 Q108 68 128 68 Q148 68 148 95" fill="#008489" opacity="0.15" stroke="#008489" strokeWidth="2" />

      {/* Heart between them */}
      <g transform="translate(88, 50) scale(0.7)">
        <path
          d="M15 8 Q15 0 22 0 Q30 0 30 8 Q30 0 37 0 Q44 0 44 8 Q44 18 30 28 Q15 18 15 8Z"
          fill="#E31C5F"
          opacity="0.6"
        />
      </g>

      {/* Connection arc */}
      <path
        d="M85 75 Q100 60 115 75"
        stroke="#E31C5F"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        fill="none"
        opacity="0.3"
      />

      {/* Small maple leaf */}
      <g transform="translate(90, 100) scale(0.35)">
        <path
          d="M25 0 L28 10 L38 8 L32 16 L40 22 L30 22 L28 32 L25 24 L22 32 L20 22 L10 22 L18 16 L12 8 L22 10Z"
          fill="#E31C5F"
          opacity="0.4"
        />
      </g>

      {/* Sparkle accents */}
      <circle cx="60" cy="110" r="1.5" fill="#008489" opacity="0.3" />
      <circle cx="140" cy="110" r="1.5" fill="#E31C5F" opacity="0.3" />
    </svg>
  );
}

export function AirplaneIllustration({ className, width = 200 }: IllustrationProps) {
  return (
    <svg
      width={width}
      height={width * 0.5}
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Dotted trail */}
      <path
        d="M10 70 Q40 75 60 60 Q80 45 110 50 Q140 55 155 40"
        stroke="#008489"
        strokeWidth="2"
        strokeDasharray="5 4"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Airplane body */}
      <g transform="translate(155, 25) rotate(-20)">
        {/* Fuselage */}
        <ellipse cx="18" cy="10" rx="18" ry="5" fill="#008489" />
        {/* Wings */}
        <path d="M12 10 L8 0 L22 7Z" fill="#008489" opacity="0.7" />
        <path d="M12 10 L8 20 L22 13Z" fill="#008489" opacity="0.7" />
        {/* Tail */}
        <path d="M0 10 L-4 3 L4 8Z" fill="#008489" opacity="0.6" />
        <path d="M0 10 L-4 17 L4 12Z" fill="#008489" opacity="0.6" />
        {/* Windows */}
        <circle cx="22" cy="10" r="1.5" fill="white" opacity="0.8" />
        <circle cx="18" cy="10" r="1.5" fill="white" opacity="0.6" />
        <circle cx="14" cy="10" r="1.5" fill="white" opacity="0.4" />
      </g>

      {/* Trail start dot */}
      <circle cx="10" cy="70" r="3" fill="#E31C5F" opacity="0.5" />

      {/* Small clouds */}
      <g opacity="0.15">
        <ellipse cx="50" cy="30" rx="15" ry="6" fill="#008489" />
        <ellipse cx="59" cy="26" rx="10" ry="5" fill="#008489" />
      </g>
      <g opacity="0.1">
        <ellipse cx="120" cy="20" rx="12" ry="5" fill="#008489" />
        <ellipse cx="128" cy="17" rx="8" ry="4" fill="#008489" />
      </g>

      {/* Sparkle at destination */}
      <path d="M188 18 L190 23 L195 25 L190 27 L188 32 L186 27 L181 25 L186 23Z" fill="#E31C5F" opacity="0.5" />
    </svg>
  );
}

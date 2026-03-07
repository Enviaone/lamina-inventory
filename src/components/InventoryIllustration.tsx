const InventoryIllustration = () => {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background gradient shape */}
      <defs>
        <linearGradient
          id="bgGrad"
          x1="0"
          y1="0"
          x2="800"
          y2="600"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>
        <linearGradient id="primaryGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="shelfGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C7D2FE" />
          <stop offset="100%" stopColor="#A5B4FC" />
        </linearGradient>
        <linearGradient id="boxGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="boxGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="boxGrad3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A5B4FC" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
        </linearGradient>
        <filter id="shadow" x="-4%" y="-4%" width="108%" height="108%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="8"
            floodColor="#4F46E5"
            floodOpacity="0.1"
          />
        </filter>
        <filter id="shadowSm" x="-2%" y="-2%" width="104%" height="104%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="4"
            floodColor="#4F46E5"
            floodOpacity="0.08"
          />
        </filter>
      </defs>

      {/* Soft background blob */}
      <ellipse
        cx="350"
        cy="320"
        rx="380"
        ry="280"
        fill="url(#bgGrad)"
        opacity="0.6"
      />

      {/* === WAREHOUSE SHELVES === */}
      {/* Shelf structure - left side */}
      <g filter="url(#shadowSm)">
        {/* Shelf legs */}
        <rect x="80" y="160" width="8" height="320" rx="4" fill="#A5B4FC" />
        <rect x="312" y="160" width="8" height="320" rx="4" fill="#A5B4FC" />

        {/* Shelf planks */}
        <rect
          x="72"
          y="200"
          width="256"
          height="8"
          rx="4"
          fill="url(#shelfGrad)"
        />
        <rect
          x="72"
          y="300"
          width="256"
          height="8"
          rx="4"
          fill="url(#shelfGrad)"
        />
        <rect
          x="72"
          y="400"
          width="256"
          height="8"
          rx="4"
          fill="url(#shelfGrad)"
        />
      </g>

      {/* Boxes on top shelf */}
      <g filter="url(#shadowSm)">
        <rect
          x="92"
          y="160"
          width="52"
          height="40"
          rx="6"
          fill="url(#boxGrad1)"
        />
        <rect
          x="102"
          y="170"
          width="32"
          height="4"
          rx="2"
          fill="#E0E7FF"
          opacity="0.6"
        />
        <rect
          x="102"
          y="178"
          width="20"
          height="4"
          rx="2"
          fill="#E0E7FF"
          opacity="0.4"
        />

        <rect
          x="156"
          y="152"
          width="44"
          height="48"
          rx="6"
          fill="url(#boxGrad2)"
        />
        <rect
          x="164"
          y="164"
          width="28"
          height="4"
          rx="2"
          fill="#E0E7FF"
          opacity="0.6"
        />

        <rect
          x="212"
          y="164"
          width="48"
          height="36"
          rx="6"
          fill="url(#boxGrad3)"
        />
        <rect
          x="222"
          y="174"
          width="28"
          height="4"
          rx="2"
          fill="#E0E7FF"
          opacity="0.5"
        />

        <rect
          x="272"
          y="158"
          width="36"
          height="42"
          rx="6"
          fill="url(#boxGrad1)"
        />
      </g>

      {/* Boxes on middle shelf */}
      <g filter="url(#shadowSm)">
        <rect
          x="88"
          y="258"
          width="56"
          height="42"
          rx="6"
          fill="url(#boxGrad3)"
        />
        <rect
          x="98"
          y="268"
          width="36"
          height="4"
          rx="2"
          fill="#E0E7FF"
          opacity="0.5"
        />
        <rect
          x="98"
          y="276"
          width="24"
          height="4"
          rx="2"
          fill="#E0E7FF"
          opacity="0.3"
        />

        <rect
          x="158"
          y="262"
          width="40"
          height="38"
          rx="6"
          fill="url(#boxGrad1)"
        />
        <rect
          x="166"
          y="272"
          width="24"
          height="4"
          rx="2"
          fill="#E0E7FF"
          opacity="0.6"
        />

        <rect
          x="212"
          y="256"
          width="48"
          height="44"
          rx="6"
          fill="url(#boxGrad2)"
        />

        <rect
          x="274"
          y="264"
          width="36"
          height="36"
          rx="6"
          fill="url(#boxGrad3)"
        />
      </g>

      {/* Boxes on bottom shelf */}
      <g filter="url(#shadowSm)">
        <rect
          x="92"
          y="360"
          width="60"
          height="40"
          rx="6"
          fill="url(#boxGrad2)"
        />
        <rect
          x="168"
          y="356"
          width="44"
          height="44"
          rx="6"
          fill="url(#boxGrad3)"
        />
        <rect
          x="226"
          y="362"
          width="38"
          height="38"
          rx="6"
          fill="url(#boxGrad1)"
        />
        <rect
          x="278"
          y="358"
          width="30"
          height="42"
          rx="6"
          fill="url(#boxGrad2)"
        />
      </g>

      {/* === FLOATING DASHBOARD CARD === */}
      <g filter="url(#shadow)">
        <rect x="380" y="100" width="340" height="200" rx="16" fill="white" />

        {/* Dashboard header */}
        <rect
          x="400"
          y="120"
          width="80"
          height="8"
          rx="4"
          fill="#4F46E5"
          opacity="0.8"
        />
        <rect x="400" y="134" width="120" height="6" rx="3" fill="#C7D2FE" />

        {/* Mini bar chart */}
        <rect
          x="410"
          y="230"
          width="18"
          height="40"
          rx="4"
          fill="url(#chartGrad)"
        />
        <rect
          x="436"
          y="215"
          width="18"
          height="55"
          rx="4"
          fill="url(#chartGrad)"
        />
        <rect
          x="462"
          y="240"
          width="18"
          height="30"
          rx="4"
          fill="url(#chartGrad)"
        />
        <rect
          x="488"
          y="205"
          width="18"
          height="65"
          rx="4"
          fill="url(#chartGrad)"
        />
        <rect
          x="514"
          y="225"
          width="18"
          height="45"
          rx="4"
          fill="url(#chartGrad)"
        />
        <rect
          x="540"
          y="210"
          width="18"
          height="60"
          rx="4"
          fill="url(#chartGrad)"
        />
        <rect
          x="566"
          y="235"
          width="18"
          height="35"
          rx="4"
          fill="url(#chartGrad)"
        />

        {/* Chart baseline */}
        <line
          x1="400"
          y1="272"
          x2="596"
          y2="272"
          stroke="#E0E7FF"
          strokeWidth="1.5"
        />

        {/* Stats boxes */}
        <rect x="620" y="160" width="80" height="36" rx="8" fill="#EEF2FF" />
        <rect x="630" y="170" width="40" height="6" rx="3" fill="#6366F1" />
        <rect x="630" y="180" width="56" height="5" rx="2.5" fill="#C7D2FE" />

        <rect x="620" y="206" width="80" height="36" rx="8" fill="#EEF2FF" />
        <rect x="630" y="216" width="48" height="6" rx="3" fill="#4F46E5" />
        <rect x="630" y="226" width="36" height="5" rx="2.5" fill="#C7D2FE" />

        <rect x="620" y="252" width="80" height="36" rx="8" fill="#EEF2FF" />
        <rect x="630" y="262" width="32" height="6" rx="3" fill="#818CF8" />
        <rect x="630" y="272" width="52" height="5" rx="2.5" fill="#C7D2FE" />
      </g>

      {/* === FLOATING INVENTORY CARD === */}
      <g filter="url(#shadow)">
        <rect x="420" y="340" width="260" height="140" rx="14" fill="white" />

        {/* Card content - inventory list */}
        <rect
          x="440"
          y="360"
          width="60"
          height="6"
          rx="3"
          fill="#4F46E5"
          opacity="0.7"
        />

        {/* List items */}
        <rect x="440" y="380" width="16" height="16" rx="4" fill="#EEF2FF" />
        <rect
          x="462"
          y="383"
          width="80"
          height="5"
          rx="2.5"
          fill="#6366F1"
          opacity="0.6"
        />
        <rect x="462" y="392" width="50" height="4" rx="2" fill="#C7D2FE" />
        <rect x="610" y="384" width="50" height="10" rx="5" fill="#DCFCE7" />
        <rect x="618" y="387" width="34" height="4" rx="2" fill="#22C55E" />

        <rect x="440" y="408" width="16" height="16" rx="4" fill="#EEF2FF" />
        <rect
          x="462"
          y="411"
          width="90"
          height="5"
          rx="2.5"
          fill="#6366F1"
          opacity="0.6"
        />
        <rect x="462" y="420" width="60" height="4" rx="2" fill="#C7D2FE" />
        <rect x="610" y="412" width="50" height="10" rx="5" fill="#FEF3C7" />
        <rect x="618" y="415" width="34" height="4" rx="2" fill="#F59E0B" />

        <rect x="440" y="436" width="16" height="16" rx="4" fill="#EEF2FF" />
        <rect
          x="462"
          y="439"
          width="70"
          height="5"
          rx="2.5"
          fill="#6366F1"
          opacity="0.6"
        />
        <rect x="462" y="448" width="44" height="4" rx="2" fill="#C7D2FE" />
        <rect x="610" y="440" width="50" height="10" rx="5" fill="#DCFCE7" />
        <rect x="618" y="443" width="34" height="4" rx="2" fill="#22C55E" />
      </g>

      {/* === BARCODE SCANNER === */}
      <g filter="url(#shadowSm)" transform="translate(120, 430) rotate(-15)">
        {/* Scanner body */}
        <rect
          x="0"
          y="0"
          width="80"
          height="40"
          rx="8"
          fill="url(#primaryGrad)"
        />
        {/* Scanner head */}
        <rect x="68" y="6" width="30" height="28" rx="6" fill="#4338CA" />
        {/* Scanner beam */}
        <line
          x1="98"
          y1="20"
          x2="140"
          y2="20"
          stroke="#EF4444"
          strokeWidth="2"
          opacity="0.7"
        />
        <line
          x1="130"
          y1="14"
          x2="140"
          y2="20"
          stroke="#EF4444"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <line
          x1="130"
          y1="26"
          x2="140"
          y2="20"
          stroke="#EF4444"
          strokeWidth="1.5"
          opacity="0.4"
        />
        {/* Scanner details */}
        <rect x="10" y="12" width="20" height="16" rx="3" fill="#6366F1" />
        <rect
          x="14"
          y="16"
          width="12"
          height="3"
          rx="1.5"
          fill="#E0E7FF"
          opacity="0.6"
        />
        <rect
          x="14"
          y="22"
          width="8"
          height="3"
          rx="1.5"
          fill="#E0E7FF"
          opacity="0.4"
        />
        {/* Handle */}
        <rect
          x="20"
          y="38"
          width="16"
          height="30"
          rx="6"
          fill="url(#primaryGrad)"
        />
      </g>

      {/* === FLOATING UI ELEMENTS === */}
      {/* Stock notification badge */}
      <g filter="url(#shadowSm)">
        <rect x="340" y="60" width="100" height="32" rx="16" fill="white" />
        <circle cx="360" cy="76" r="8" fill="#22C55E" />
        <rect
          x="374"
          y="72"
          width="52"
          height="5"
          rx="2.5"
          fill="#6366F1"
          opacity="0.5"
        />
        <rect x="374" y="80" width="36" height="4" rx="2" fill="#C7D2FE" />
      </g>

      {/* Percentage badge */}
      <g filter="url(#shadowSm)">
        <rect
          x="660"
          y="60"
          width="72"
          height="28"
          rx="14"
          fill="url(#primaryGrad)"
        />
        <text
          x="696"
          y="79"
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="600"
          fontFamily="system-ui"
        >
          +24%
        </text>
      </g>

      {/* Small floating package icon */}
      <g filter="url(#shadowSm)">
        <rect x="56" y="120" width="44" height="44" rx="12" fill="white" />
        <rect x="66" y="130" width="24" height="24" rx="4" fill="#EEF2FF" />
        <path
          d="M78 136 L84 139 L84 148 L78 151 L72 148 L72 139 Z"
          fill="url(#boxGrad1)"
          opacity="0.8"
        />
      </g>

      {/* Circular progress indicator */}
      <g filter="url(#shadowSm)">
        <circle cx="720" cy="360" r="28" fill="white" />
        <circle
          cx="720"
          cy="360"
          r="20"
          fill="none"
          stroke="#E0E7FF"
          strokeWidth="4"
        />
        <circle
          cx="720"
          cy="360"
          r="20"
          fill="none"
          stroke="url(#primaryGrad)"
          strokeWidth="4"
          strokeDasharray="94"
          strokeDashoffset="28"
          strokeLinecap="round"
          transform="rotate(-90 720 360)"
        />
        <text
          x="720"
          y="364"
          textAnchor="middle"
          fill="#4F46E5"
          fontSize="11"
          fontWeight="700"
          fontFamily="system-ui"
        >
          70%
        </text>
      </g>

      {/* Small dots decoration */}
      <circle cx="360" cy="520" r="3" fill="#C7D2FE" opacity="0.5" />
      <circle cx="380" cy="530" r="2" fill="#A5B4FC" opacity="0.4" />
      <circle cx="340" cy="535" r="2.5" fill="#818CF8" opacity="0.3" />
      <circle cx="700" cy="440" r="3" fill="#C7D2FE" opacity="0.5" />
      <circle cx="680" cy="460" r="2" fill="#A5B4FC" opacity="0.4" />
      <circle cx="720" cy="455" r="2" fill="#818CF8" opacity="0.3" />
      <circle cx="520" cy="510" r="3" fill="#C7D2FE" opacity="0.4" />
      <circle cx="545" cy="520" r="2" fill="#A5B4FC" opacity="0.3" />
    </svg>
  );
};

export default InventoryIllustration;

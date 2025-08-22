export function RedwoodTreeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
      <svg
        viewBox="0 0 800 600"
        className="absolute right-0 top-0 h-full w-auto scale-110"
        fill="currentColor"
        aria-hidden="true"
      >
        {/* Interconnected Root System - symbolizing community */}
        <g className="text-jobequal-green">
          <path
            d="M400 580 Q380 560 360 550 Q340 540 320 545 Q300 550 285 560 Q270 570 260 580"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M400 580 Q420 560 440 550 Q460 540 480 545 Q500 550 515 560 Q530 570 540 580"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M300 575 Q280 555 260 545 Q240 535 220 540 Q200 545 185 555"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M500 575 Q520 555 540 545 Q560 535 580 540 Q600 545 615 555"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          />
          {/* Central connecting roots */}
          <path
            d="M350 565 Q380 555 400 560 Q420 555 450 565"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M320 570 Q350 565 400 570 Q450 565 480 570"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          />
        </g>

        {/* Tree Trunks - Multiple trees representing community */}
        <g className="text-jobequal-green-dark">
          {/* Main central tree */}
          <path
            d="M395 580 L405 580 L410 200 Q410 190 400 190 Q390 190 390 200 Z"
            fill="currentColor"
            opacity="0.8"
          />

          {/* Supporting trees */}
          <path
            d="M365 580 L372 580 L375 280 Q375 275 370 275 Q365 275 365 280 Z"
            fill="currentColor"
            opacity="0.6"
          />
          <path
            d="M425 580 L432 580 L435 280 Q435 275 430 275 Q425 275 425 280 Z"
            fill="currentColor"
            opacity="0.6"
          />

          {/* Smaller community trees */}
          <path
            d="M320 580 L325 580 L327 350 Q327 347 324 347 Q321 347 321 350 Z"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M475 580 L480 580 L482 350 Q482 347 479 347 Q476 347 476 350 Z"
            fill="currentColor"
            opacity="0.4"
          />
        </g>

        {/* Canopy - Interconnected growth */}
        <g className="text-jobequal-green">
          {/* Main tree canopy */}
          <ellipse
            cx="400"
            cy="150"
            rx="85"
            ry="75"
            fill="currentColor"
            opacity="0.3"
          />
          <ellipse
            cx="385"
            cy="120"
            rx="70"
            ry="60"
            fill="currentColor"
            opacity="0.25"
          />
          <ellipse
            cx="415"
            cy="125"
            rx="65"
            ry="55"
            fill="currentColor"
            opacity="0.25"
          />
          <ellipse
            cx="400"
            cy="100"
            rx="50"
            ry="45"
            fill="currentColor"
            opacity="0.2"
          />

          {/* Supporting tree canopies */}
          <ellipse
            cx="370"
            cy="230"
            rx="50"
            ry="45"
            fill="currentColor"
            opacity="0.2"
          />
          <ellipse
            cx="430"
            cy="235"
            rx="48"
            ry="42"
            fill="currentColor"
            opacity="0.2"
          />

          {/* Smaller community tree canopies */}
          <ellipse
            cx="324"
            cy="310"
            rx="35"
            ry="30"
            fill="currentColor"
            opacity="0.15"
          />
          <ellipse
            cx="479"
            cy="315"
            rx="33"
            ry="28"
            fill="currentColor"
            opacity="0.15"
          />

          {/* Interconnecting foliage - showing growth together */}
          <ellipse
            cx="385"
            cy="180"
            rx="25"
            ry="20"
            fill="currentColor"
            opacity="0.15"
          />
          <ellipse
            cx="415"
            cy="185"
            rx="23"
            ry="18"
            fill="currentColor"
            opacity="0.15"
          />
          <ellipse
            cx="350"
            cy="270"
            rx="20"
            ry="15"
            fill="currentColor"
            opacity="0.1"
          />
          <ellipse
            cx="450"
            cy="275"
            rx="20"
            ry="15"
            fill="currentColor"
            opacity="0.1"
          />
        </g>

        {/* Subtle connection lines - representing network effect */}
        <g className="text-jobequal-teal" opacity="0.1">
          <path
            d="M370 200 Q380 190 400 185 Q420 190 430 200"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
          <path
            d="M340 280 Q360 270 400 265 Q440 270 460 280"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
          <path
            d="M324 330 Q350 320 400 315 Q450 320 479 330"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}

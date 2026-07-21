import { useId, type SVGProps } from "react";

type BrandSvgProps = Omit<SVGProps<SVGSVGElement>, "children">;

function mergeClassName(className?: string) {
  return className ?? undefined;
}

/**
 * The supplied DEAL lock-up, separated into its three visual beats so the
 * globe mark, wordmark and tagline can enter in a meaningful sequence.
 */
export function DealStagedLogo({
  className,
  viewBox = "0 0 253 114",
  ...props
}: BrandSvgProps) {
  const clipBase = useId().replace(/:/g, "");

  return (
    <svg
      {...props}
      data-assembled-logo="true"
      className={mergeClassName(className)}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role={props.role ?? "img"}
      aria-label={props["aria-label"] ?? "DEAL — Invest in the Future"}
    >
      <title>DEAL — Invest in the Future</title>
      <defs>
        <clipPath id={`${clipBase}-mark`}>
          <rect x="0" y="0" width="114" height="114" />
        </clipPath>
        <clipPath id={`${clipBase}-wordmark`}>
          <rect x="114" y="24" width="116" height="41" />
        </clipPath>
        <clipPath id={`${clipBase}-tagline`}>
          <rect x="114" y="69" width="116" height="13" />
        </clipPath>
      </defs>

      <g data-logo-mark="true" clipPath={`url(#${clipBase}-mark)`}>
        <image href="/assets/deal-logo-v2.svg" width="253" height="114" />
      </g>
      <g data-logo-wordmark="true" clipPath={`url(#${clipBase}-wordmark)`}>
        <image href="/assets/deal-logo-v2.svg" width="253" height="114" />
      </g>
      <g data-logo-tagline="true" clipPath={`url(#${clipBase}-tagline)`}>
        <image href="/assets/deal-logo-v2.svg" width="253" height="114" />
      </g>
    </svg>
  );
}

/**
 * The horizontal DEAL lock-up used by the reference design.
 *
 * The mark and lettering inherit `currentColor`, so a consumer can recolour the
 * complete lock-up with the SVG `color` prop while retaining the brand gold as
 * the default.
 */
export function DealLogo({
  className,
  color = "#d8a84f",
  viewBox = "0 0 253 114",
  ...props
}: BrandSvgProps) {
  return (
    <svg
      {...props}
      className={mergeClassName(className)}
      color={color}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role={props.role ?? "img"}
      aria-label={props["aria-label"] ?? "DEAL — Invest in the future"}
    >
      <title>DEAL — Invest in the future</title>

      <image href="/assets/deal-logo-v2.svg" width="253" height="114" />
      <g display="none" fill="currentColor" aria-hidden="true">
        {/* Outer leaves form the protective, upward-moving silhouette. */}
        <path d="M28.6 3.5 37 11.9l-5.7 5.8-2.7-2.7-2.7 2.7-5.7-5.8 8.4-8.4Z" />
        <path d="M16.5 8.7 24.8 17l-5.9 5.8-8.2-8.2 5.8-5.9Z" />
        <path d="m40.7 17 8.2-8.3 5.9 5.9-8.3 8.2-5.8-5.8Z" />
        <path d="M7.2 18.5 13 24.3v15.1l-5.8-5.8V18.5Z" />
        <path d="m50.2 24.3 5.8-5.8v15.1l-5.8 5.8V24.3Z" />

        {/* Interlocking branches — the negative space creates the tree trunk. */}
        <path d="m16.1 19.5 10 10V65l-6.3-5.6V36.1l-3.7-3.8V19.5Z" />
        <path d="m41.1 19.5-10 10V65l6.3-5.6V36.1l3.7-3.8V19.5Z" />
        <path d="M7.2 38.8 18 49.5v8.7L7.2 48.5v-9.7Z" />
        <path d="M56 38.8 45.2 49.5v8.7L56 48.5v-9.7Z" />
        <path d="m13 29.3 5.7 5.7v8.2L13 37.6v-8.3Z" opacity=".74" />
        <path d="m44.5 35 5.7-5.7v8.3l-5.7 5.6V35Z" opacity=".74" />

        {/* Small roots keep the symbol grounded at the same optical baseline. */}
        <path d="m20 58.6 6.1 5.4v9.5L20 68v-9.4Z" />
        <path d="m37.2 58.6-6.1 5.4v9.5l6.1-5.5v-9.4Z" />
      </g>

      <g display="none" fill="currentColor">
        <text
          x="74"
          y="49"
          fontFamily="Cinzel, Georgia, 'Times New Roman', serif"
          fontSize="35"
          fontWeight="500"
          letterSpacing="4.6"
        >
          DEAL
        </text>
        <text
          x="76"
          y="65.5"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="5.5"
          fontWeight="600"
          letterSpacing="2.35"
        >
          INVEST IN THE FUTURE
        </text>
      </g>
    </svg>
  );
}

const networkPoints = [
  [129, 231, 2.2],
  [158, 169, 1.6],
  [184, 293, 1.7],
  [210, 112, 2],
  [232, 210, 1.4],
  [258, 348, 2.1],
  [277, 151, 1.7],
  [302, 260, 2.4],
  [330, 79, 1.5],
  [352, 186, 1.8],
  [371, 333, 1.6],
  [403, 120, 2.5],
  [420, 239, 1.3],
  [441, 392, 2.1],
  [467, 74, 1.8],
  [481, 178, 1.6],
  [504, 292, 2.3],
  [535, 123, 1.4],
  [554, 226, 2],
  [574, 366, 1.7],
  [604, 177, 2.2],
  [634, 278, 1.5],
  [670, 222, 2.4],
] as const;

/**
 * A transparent, code-native golden globe overlay for the hero image.
 * It contains only SVG geometry and can therefore scale without losing detail.
 */
export function HeroNetworkGlobe({
  className,
  color = "#d9a44a",
  viewBox = "0 0 800 520",
  ...props
}: BrandSvgProps) {
  return (
    <svg
      {...props}
      className={mergeClassName(className)}
      color={color}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      role={props.role ?? "img"}
      aria-label={props["aria-label"] ?? "Golden global connection network"}
      preserveAspectRatio={props.preserveAspectRatio ?? "xMidYMid meet"}
    >
      <title>Golden global connection network</title>
      <defs>
        <radialGradient id="deal-network-fade" cx="50%" cy="46%" r="56%">
          <stop offset="0" stopColor="currentColor" stopOpacity=".12" />
          <stop offset=".66" stopColor="currentColor" stopOpacity=".035" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="deal-network-rim" x1="111" y1="85" x2="690" y2="430" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity=".08" />
          <stop offset=".46" stopColor="currentColor" stopOpacity=".58" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".16" />
        </linearGradient>
        <linearGradient id="deal-network-line" x1="120" y1="84" x2="682" y2="416" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity=".08" />
          <stop offset=".32" stopColor="currentColor" stopOpacity=".44" />
          <stop offset=".72" stopColor="currentColor" stopOpacity=".68" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".12" />
        </linearGradient>
        <radialGradient id="deal-node-flare">
          <stop stopColor="#fff7d5" stopOpacity="1" />
          <stop offset=".2" stopColor="currentColor" stopOpacity=".95" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <filter id="deal-network-glow" x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="deal-network-sphere-clip">
          <circle cx="400" cy="260" r="292" />
        </clipPath>
      </defs>

      {/* A nearly invisible wash keeps the web legible over a photographic sky. */}
      <circle cx="400" cy="260" r="292" fill="url(#deal-network-fade)" />

      <g clipPath="url(#deal-network-sphere-clip)" vectorEffect="non-scaling-stroke">
        {/* Latitude bands. */}
        <g stroke="url(#deal-network-line)" strokeWidth=".72" opacity=".7">
          <ellipse cx="400" cy="260" rx="291" ry="49" />
          <ellipse cx="400" cy="260" rx="291" ry="112" />
          <ellipse cx="400" cy="260" rx="291" ry="185" />
          <path d="M135 140c85 54 176 78 265 78s180-24 265-78" />
          <path d="M135 380c85-54 176-78 265-78s180 24 265 78" />
        </g>

        {/* Longitude bands; small rotations prevent the sphere feeling mechanical. */}
        <g stroke="url(#deal-network-line)" strokeWidth=".72" opacity=".66">
          <ellipse cx="400" cy="260" rx="72" ry="292" />
          <ellipse cx="400" cy="260" rx="143" ry="292" />
          <ellipse cx="400" cy="260" rx="220" ry="292" />
          <ellipse cx="400" cy="260" rx="108" ry="292" transform="rotate(26 400 260)" />
          <ellipse cx="400" cy="260" rx="108" ry="292" transform="rotate(-26 400 260)" />
          <ellipse cx="400" cy="260" rx="184" ry="292" transform="rotate(47 400 260)" opacity=".62" />
          <ellipse cx="400" cy="260" rx="184" ry="292" transform="rotate(-47 400 260)" opacity=".62" />
        </g>

        {/* Irregular triangulated connections echo the reference's digital mesh. */}
        <g stroke="currentColor" strokeWidth=".62" strokeOpacity=".42">
          <path d="m129 231 81-119 67 39 53-72 73 41 64-46 68 49 69 54 66 45" />
          <path d="m158 169 74 41 45-59 75 35 51-66 78 58 54-55" />
          <path d="m129 231 55 62 48-83 70 50 50-74 68 53 61-61 73 48 50-49" />
          <path d="m184 293 74 55 44-88 69 73 49-94 84 53 50-66 80 52 36-56" />
          <path d="m258 348 113-15 70 59 63-100 70 74 60-88" />
          <path d="M210 112 232 210 330 79 352 186 467 74 481 178 604 177 670 222" />
          <path d="m129 231 103-21 26 138 112-15 34-213 100 172 31-169 99 155" />
          <path d="M158 169 302 260 277 151 420 239 403 120 554 226 535 123 670 222" />
          <path d="M184 293 302 260 258 348 420 239 441 392 504 292 574 366 634 278" />
          <path d="M210 112 352 186 277 151 403 120 481 178 535 123 604 177" />
          <path d="m232 210 118-24 21 147 49-94 84 53 50-66 80 52" />
          <path d="m330 79 73 41 64-46 68 49 69 54" />
        </g>

        {/* Select sweeping routes are a little brighter than the mesh. */}
        <g stroke="currentColor" strokeLinecap="round" vectorEffect="non-scaling-stroke">
          <path d="M137 293C225 118 407 64 653 190" strokeWidth="1" strokeOpacity=".52" />
          <path d="M183 361C294 167 492 128 671 274" strokeWidth=".9" strokeOpacity=".48" />
          <path d="M222 119C365 207 523 213 665 154" strokeWidth=".9" strokeOpacity=".42" />
          <path d="M157 222C303 297 487 329 648 250" strokeWidth=".8" strokeOpacity=".38" />
          <path d="M273 77C416 127 547 218 607 380" strokeWidth=".82" strokeOpacity=".36" />
        </g>

        {/* Dotted secondary routes add the fine technical detail in the hero. */}
        <g stroke="currentColor" strokeWidth=".74" strokeDasharray="1.2 5.5" strokeLinecap="round" opacity=".58">
          <path d="M114 264C252 76 506 52 684 221" />
          <path d="M160 391C302 248 505 199 681 319" />
          <path d="M210 104C320 300 485 387 621 389" />
          <path d="M289 57C422 171 527 273 578 443" />
        </g>
      </g>

      {/* Sphere contour. */}
      <circle
        cx="400"
        cy="260"
        r="292"
        stroke="url(#deal-network-rim)"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M144 119A292 292 0 0 1 682 335"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeOpacity=".5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Nodes sit over the grid so their pinpoints remain crisp at small sizes. */}
      <g fill="currentColor" aria-hidden="true">
        {networkPoints.map(([cx, cy, radius]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r={radius * 3.6} fill="url(#deal-node-flare)" opacity=".58" />
            <circle cx={cx} cy={cy} r={radius} opacity=".9" />
            <circle cx={cx} cy={cy} r={Math.max(.45, radius * .31)} fill="#fff4c7" />
          </g>
        ))}
      </g>

      {/* Hero focal node. */}
      <g filter="url(#deal-network-glow)" aria-hidden="true">
        <circle cx="504" cy="292" r="19" fill="url(#deal-node-flare)" opacity=".65" />
        <circle cx="504" cy="292" r="3.2" fill="#fff4c7" />
        <circle cx="504" cy="292" r="8.5" stroke="currentColor" strokeWidth=".65" opacity=".62" />
      </g>
    </svg>
  );
}

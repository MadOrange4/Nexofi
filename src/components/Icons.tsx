import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const defaults = (size = 16, props: IconProps): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

/* ── Status / Activity ─────────────────────────── */

export function CoffeeIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}

export function LightningIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" />
    </svg>
  );
}

export function AiSparkleIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
    </svg>
  );
}

export function BuildingIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22V12h6v10" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01" />
    </svg>
  );
}

export function MonitorIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

export function ChairIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <path d="M5 11a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2H5v-2z" />
      <path d="M19 13v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5" />
      <line x1="7" y1="20" x2="7" y2="22" />
      <line x1="17" y1="20" x2="17" y2="22" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

export function TargetIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function PalmTreeIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <path d="M12 22V8" />
      <path d="M5 8c0-3 2.5-5 7-5s7 2 7 5c0 0-3.5-.5-7 2.5S5 8 5 8z" />
      <path d="M8 22h8" />
    </svg>
  );
}

export function ClipboardIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

export function BarChartIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

export function DoorIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
      <path d="M14 12h.01" />
      <path d="M10 2v20" />
    </svg>
  );
}

export function SunIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

export function GearIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function CheckIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function PlayIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

export function ArrowRightIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function OnlineDotIcon({ size = 10, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" {...props}>
      <circle cx="5" cy="5" r="4" fill="currentColor" />
    </svg>
  );
}

export function UsersIcon({ size, ...props }: IconProps = {}) {
  return (
    <svg {...defaults(size, props)}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

const defaultIconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg
      {...defaultIconProps}
      strokeWidth={2.2}
      {...props}
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M12 3 2.5 20h19L12 3Z" />
      <path d="M12 9v5" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}

export function InformationIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M12 3 5 6v5c0 4.8 2.8 8.1 7 10 4.2-1.9 7-5.2 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function CalculatorIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <rect x="4" y="2.5" width="16" height="19" rx="3" />
      <path d="M8 6.5h8v3H8z" />
      <path d="M8 13h.01" />
      <path d="M12 13h.01" />
      <path d="M16 13h.01" />
      <path d="M8 17h.01" />
      <path d="M12 17h.01" />
      <path d="M16 17h.01" />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

export function HeartPulseIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
      <path d="M3.5 12h4l1.5-3 3 7 2-4h6.5" />
    </svg>
  );
}

export function ActivityIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  );
}

export function BloodDropIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M12 3s6 6.1 6 11a6 6 0 0 1-12 0c0-4.9 6-11 6-11Z" />
    </svg>
  );
}

export function BloodPressureIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M7 4v6a5 5 0 0 0 10 0V4" />
      <path d="M9 4h6" />
      <path d="M12 15v3" />
      <path d="M9 21h6" />
    </svg>
  );
}

export function BrainIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M9.5 4.5A3 3 0 0 0 6 7.4 3.5 3.5 0 0 0 5 14a3 3 0 0 0 4 4.5" />
      <path d="M14.5 4.5A3 3 0 0 1 18 7.4a3.5 3.5 0 0 1 1 6.6 3 3 0 0 1-4 4.5" />
      <path d="M12 4v16" />
      <path d="M9 9h3" />
      <path d="M12 14h3" />
    </svg>
  );
}

export function KidneyIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M9.5 4.5C6 3 3.5 5.7 3.5 9.5c0 4.8 3.2 8 7.5 8V12c-1.8 0-2.5-1-2.5-2.5" />
      <path d="M14.5 4.5c3.5-1.5 6 1.2 6 5 0 4.8-3.2 8-7.5 8V12c1.8 0 2.5-1 2.5-2.5" />
    </svg>
  );
}

export function LiverIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M4 12c0-5 4-8 9-8h3c2.8 0 4 2.2 4 4.5V11c-3.5 0-5 1.5-6 4-1.2 3-3.8 5-7 5H5c-.7-2.4-1-5.2-1-8Z" />
      <path d="M11 8c1.5 2 3.8 3 7 3" />
    </svg>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function MedicationIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="m8.5 4.5 11 11a3.5 3.5 0 0 1-5 5l-11-11a3.5 3.5 0 0 1 5-5Z" />
      <path d="m9 10 5-5" />
      <path d="m10 15 5-5" />
    </svg>
  );
}

export function AlcoholIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M6 3h12l-1.5 7a4.5 4.5 0 0 1-9 0L6 3Z" />
      <path d="M12 14.5V21" />
      <path d="M8 21h8" />
      <path d="M7 7h10" />
    </svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19H2" />
    </svg>
  );
}

export function TrendingUpIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M4 5h16" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

export function ResetIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v6h6" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export function FileTextIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M8 9h2" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="m12 3-1.2 3.3a4 4 0 0 1-2.4 2.4L5 10l3.4 1.3a4 4 0 0 1 2.4 2.4L12 17l1.2-3.3a4 4 0 0 1 2.4-2.4L19 10l-3.4-1.3a4 4 0 0 1-2.4-2.4L12 3Z" />
      <path d="m19 16-.6 1.6a2 2 0 0 1-1.2 1.2l-1.7.7 1.7.7a2 2 0 0 1 1.2 1.2L19 23l.6-1.6a2 2 0 0 1 1.2-1.2l1.7-.7-1.7-.7a2 2 0 0 1-1.2-1.2L19 16Z" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M15 3h6v6" />
      <path d="m10 14 11-11" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
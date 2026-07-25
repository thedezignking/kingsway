// Admin icon set — Heroicons (solid). Plain SVG components (no runtime fetch, server-safe), wrapped
// to a { size, className } API. Named exports are used directly; the Icon map is for AdminNav's
// dynamic lookup.
import {
  Squares2X2Icon as HiOverview,
  UsersIcon as HiUsers,
  UserPlusIcon as HiUserPlus,
  ChartBarIcon as HiChart,
  CalendarDaysIcon as HiCalendar,
  EnvelopeIcon as HiEnvelope,
  ArrowTrendingUpIcon as HiTrend,
  MagnifyingGlassIcon as HiSearch,
  PlusIcon as HiPlus,
  BellIcon as HiBell,
  ClipboardDocumentCheckIcon as HiClipboardCheck,
  UserGroupIcon as HiUserGroup,
} from "@heroicons/react/24/solid";

type IconProps = { size?: number; className?: string };
type HeroCmp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

function make(Hero: HeroCmp) {
  return function IconCmp({ size = 18, className = "" }: IconProps) {
    return <Hero width={size} height={size} className={className} aria-hidden="true" />;
  };
}

// Navigation
export const OverviewIcon = make(HiOverview);
export const KingsIcon = make(HiUsers);
export const InsightsIcon = make(HiChart);
export const KingsHourIcon = make(HiCalendar);
export const EmailIcon = make(HiEnvelope);
export const AnalyticsIcon = make(HiTrend);
// Chrome
export const SearchIcon = make(HiSearch);
export const PlusIcon = make(HiPlus);
export const BellIcon = make(HiBell);
// KPI cards
export const JoinedIcon = make(HiUserPlus);
export const CensusIcon = make(HiClipboardCheck);
export const AttendanceIcon = make(HiUserGroup);

export const Icon = {
  overview: OverviewIcon,
  kings: KingsIcon,
  insights: InsightsIcon,
  kingshour: KingsHourIcon,
  email: EmailIcon,
  analytics: AnalyticsIcon,
} as const;

export type IconName = keyof typeof Icon;

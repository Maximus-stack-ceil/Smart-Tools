import React from 'react';
import {
  BadgePercent,
  HeartPulse,
  CalendarDays,
  FileText,
  Code2,
  QrCode,
  Palette,
  Compass,
  Percent,
  Cake,
  Landmark,
  Activity,
  Type,
  KeyRound,
  Braces,
  Binary,
  ArrowRightLeft,
  CalendarRange,
  Fingerprint,
  Image,
  Wrench,
  Sparkles,
} from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

const iconMap: Record<string, React.ElementType> = {
  BadgePercent,
  HeartPulse,
  CalendarDays,
  FileText,
  Code2,
  QrCode,
  Palette,
  Compass,
  Percent,
  Cake,
  Landmark,
  Activity,
  Type,
  KeyRound,
  Braces,
  Binary,
  ArrowRightLeft,
  CalendarRange,
  Fingerprint,
  Image,
  Sparkles,
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const IconComponent = iconMap[name] || Wrench;
  return <IconComponent className={className} size={size} />;
};

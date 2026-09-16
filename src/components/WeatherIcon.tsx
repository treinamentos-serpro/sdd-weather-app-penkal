import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Snowflake,
  Sun,
} from 'lucide-react';
import type { WeatherCondition } from '../types/weather';

interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
}

const conditionIcons = {
  'Céu limpo': Sun,
  'Parcialmente nublado': CloudSun,
  Nublado: Cloud,
  Neblina: CloudFog,
  Garoa: Droplets,
  Chuva: CloudRain,
  Neve: Snowflake,
  Pancadas: CloudRain,
  Tempestade: CloudLightning,
  'Condição indisponível': Cloud,
} satisfies Record<WeatherCondition, typeof Cloud>;

export default function WeatherIcon({ condition, className }: WeatherIconProps) {
  const Icon = conditionIcons[condition];

  return <Icon aria-hidden="true" className={className} strokeWidth={1.5} />;
}

import type { Category, TimeSlot } from '@/shared/constants/domain';

export interface Preferences {
  activeDays: number[];
  timeSlots: TimeSlot[];
  categories: Category[];
  radiusM: number;
  baseLat: number | null;
  baseLng: number | null;
}

import { NextResponse } from 'next/server';
import { IrrigationSlot } from '@/lib/types';

export async function GET() {
  const schedule: IrrigationSlot[] = [
    {
      day: 'Monday',
      cellIds: ['MH-0001', 'MH-0002', 'MH-0014', 'MH-0042'],
      litersPerHectare: 4200,
      window: '05:30 AM - 07:45 AM (Low Evaporative Deficit)',
    },
    {
      day: 'Tuesday',
      cellIds: ['MH-0102', 'MH-0105', 'MH-0189', 'MH-0204'],
      litersPerHectare: 3800,
      window: '06:00 AM - 08:15 AM (Thermal Inversion Window)',
    },
    {
      day: 'Wednesday',
      cellIds: ['MH-0310', 'MH-0412', 'MH-0550'],
      litersPerHectare: 5100,
      window: '05:00 AM - 07:30 AM (Deep Root Saturation)',
    },
    {
      day: 'Thursday',
      cellIds: ['MH-0890', 'MH-0912', 'MH-1094', 'MH-1200'],
      litersPerHectare: 3500,
      window: '06:15 AM - 08:30 AM (Pulse Fertigation Cycle)',
    },
    {
      day: 'Friday',
      cellIds: ['MH-1420', 'MH-1600', 'MH-1845'],
      litersPerHectare: 4600,
      window: '05:30 AM - 08:00 AM (Sub-surface Drip Dosing)',
    },
    {
      day: 'Saturday',
      cellIds: ['MH-2100', 'MH-2405', 'MH-2801'],
      litersPerHectare: 3200,
      window: '06:00 AM - 07:45 AM (Maintenance Flush)',
    },
    {
      day: 'Sunday',
      cellIds: ['MH-3140', 'MH-3500', 'MH-4509'],
      litersPerHectare: 2900,
      window: '06:30 AM - 08:00 AM (Soil Aeration Pause)',
    },
  ];

  return NextResponse.json(schedule);
}

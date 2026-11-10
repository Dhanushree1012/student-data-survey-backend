import type { Role, RouteKey } from '../types';
import { roleAccess } from '../data/mockData';

export function canAccessRoute(role: Role, routeKey: RouteKey): boolean {
  return roleAccess[role].includes(routeKey);
}

export function calculateAge(dateOfBirth: string, screeningDate: string): number {
  const birth = new Date(dateOfBirth);
  const screening = new Date(screeningDate);
  const age = screening.getFullYear() - birth.getFullYear();
  const monthAdjustment = screening.getMonth() - birth.getMonth();

  if (monthAdjustment < 0 || (monthAdjustment === 0 && screening.getDate() < birth.getDate())) {
    return age - 1;
  }

  return age;
}

export function calculateBmi(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm) {
    return 0;
  }

  const heightInMeters = heightCm / 100;
  return Number((weightKg / (heightInMeters * heightInMeters)).toFixed(2));
}

export function exportCsv(filename: string, rows: Record<string, string | number>[]): void {
  if (!rows.length) {
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [headers.join(',')]
    .concat(
      rows.map((row) =>
        headers
          .map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`)
          .join(','),
      ),
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

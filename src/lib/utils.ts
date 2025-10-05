import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRiskScore(score: number): string {
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'High';
  return 'Severe';
}

export function getRiskColor(score: number): string {
  if (score < 25) return 'text-green-600';
  if (score < 50) return 'text-yellow-600';
  if (score < 75) return 'text-orange-600';
  return 'text-red-600';
}

export function getRiskBgColor(score: number): string {
  if (score < 25) return 'bg-green-100';
  if (score < 50) return 'bg-yellow-100';
  if (score < 75) return 'bg-orange-100';
  return 'bg-red-100';
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

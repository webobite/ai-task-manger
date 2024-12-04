import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isValid } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (!isValid(dateObj)) {
    return 'Invalid date';
  }

  return format(dateObj, 'PPp');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
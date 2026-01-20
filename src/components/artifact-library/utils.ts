import { formatDistanceToNow } from 'date-fns';

/**
 * Format a date string to relative time (e.g., "2 hours ago")
 * @param dateString ISO date string
 * @returns Formatted relative time string
 */
export function formatRelativeTime(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

import { formatDistanceToNow } from 'date-fns';

/**
 * Format a date string to relative time (e.g., "2 hours ago")
 * Handles both past and future timestamps gracefully
 * @param dateString ISO date string
 * @returns Formatted relative time string
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();

    // If the timestamp is in the future (likely due to server/client time mismatch),
    // treat it as "just now" to avoid confusing "in X hours" messages
    if (date > now) {
      return 'just now';
    }

    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateString;
  }
}

import { REGEX } from '@/constants/regex';
import { SERVER_PARAMS } from '@/constants/serverParams';
import { AudioFile, Pagination } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatSeconds(seconds: number) {
  if (!seconds) return 0;
  return new Date(seconds * 1000).toISOString().slice(14, 19);
}

export function formattedTimeToNumber(value: string) {
  const [minutes, seconds] = value.split(':');
  return parseInt(minutes) * 60 + parseInt(seconds);
}

export function ordinalString(number: number) {
  const last = number % 10;
  const lastTwo = number % 100;

  if (lastTwo === 11 || lastTwo === 12 || lastTwo === 13) return number + 'th';

  switch (last) {
    case 1:
      return number + 'st';
    case 2:
      return number + 'nd';
    case 3:
      return number + 'rd';
    default:
      return number + 'th';
  }
}

export function generateId() {
  return uuidv4();
}

export function formatTimeInput(value: string) {
  const clean = value.replace(/[^0-9:]/g, '');
  return clean.toString();
}

export function timestampIndex(string: string) {
  const index = string.indexOf('@');
  if (index === -1) return -1;
  const rawTime = string.substring(index + 1, index + 6);
  return REGEX.timestamp.test(rawTime) ? index : -1;
}

export function calculateRange(
  duration: number,
  timestamp: number,
  buffer: number
) {
  return {
    begin: Math.max(timestamp - buffer, 0),
    end: Math.min(timestamp + buffer, duration),
  };
}

export function getReadableDate(date?: Date, short: boolean = false) {
  const now = date ? new Date(date) : new Date();

  const shortOptions = {
    year: 'numeric' as 'numeric',
    month: 'short' as 'short',
    day: 'numeric' as 'numeric',
  };

  const options = {
    weekday: 'short' as 'short',
    year: 'numeric' as 'numeric',
    month: 'short' as 'short',
    day: 'numeric' as 'numeric',
    hour: '2-digit' as '2-digit',
    minute: '2-digit' as '2-digit',
    second: '2-digit' as '2-digit',
    hour12: true,
  };
  return now.toLocaleDateString('en-US', short ? shortOptions : options);
}

export function getPaginationRange(pagination?: Pagination): [number, number] {
  let start = 0;
  let end = SERVER_PARAMS.default_limit;

  if (pagination) {
    const { limit, page } = pagination;
    start = (page - 1) * limit;
    end = start + limit - 1;
  }
  return [start, end];
}

export function convertPaginationParam(
  params: URLSearchParams
): Pagination | undefined {
  const limit = params.get('limit');
  const page = params.get('page');

  if (!limit || !page) return;

  return {
    limit: parseInt(limit),
    page: parseInt(page),
  };
}

export const _ = undefined;

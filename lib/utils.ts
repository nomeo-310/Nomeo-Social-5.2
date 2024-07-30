import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDate, formatDistanceToNowStrict } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPostDate = (date:string) => {
  const fromTime = new Date(date);
  const currentTime = new Date();

  if (currentTime.getTime() - fromTime.getTime() < 24 * 60 * 60 * 1000 ) {
    return formatDistanceToNowStrict(fromTime, {addSuffix: true})
  } else {
    if (currentTime.getFullYear() === fromTime.getFullYear()) {
      return formatDate(fromTime, 'MMM d');
    } else {
      return formatDate(fromTime, 'MMM d, yyyy');
    }
  }
}

export const formatNumber = (value: number) => {
  return Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

import { isStringTrue } from '@leonardorick/utils';
import localforage from 'localforage';

export function bypass() {}

export function getRandomInt(max: number, startNumber = 0) {
  return Math.floor(Math.random() * (max - startNumber + 1)) + startNumber;
}

export function isNotExpired(time: number) {
  return !!time && time > new Date().getTime();
}

export function getExpireTime(minutes = 15, time?: number | string | Date) {
  const t = time ? getNumberTime(time) : new Date().getTime();
  return t + minutes * 60 * 1000;
}

function getNumberTime(time?: number | string | Date): number {
  let finalTime = time as number;
  if (typeof time === 'string') {
    finalTime = new Date(time).getTime();
  } else if (time instanceof Date) {
    finalTime = time.getTime();
  }
  return finalTime;
}

export function isProduction(env?: string) {
  return (env || process.env.NODE_ENV) === 'production';
}

export function dateDifference(startDate: Date, endDate: Date) {
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  let hours = endDate.getHours() - startDate.getHours();
  let minutes = endDate.getMinutes() - startDate.getMinutes();
  let seconds = endDate.getSeconds() - startDate.getSeconds();

  // Adjust for negative seconds differences by going to the previous minute
  if (seconds < 0) {
    minutes -= 1;
    seconds += 60;
  }

  // Adjust for negative minutes differences by going to the previous hour
  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }

  // Adjust for negative hours differences by going to the previous day
  if (hours < 0) {
    days -= 1;
    hours += 24;
  }

  // Adjust for negative day differences by going to the previous month
  if (days < 0) {
    months -= 1;
    // Use the previous month's last day to get the exact number of days
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  // Adjust for negative month differences by going to the previous year
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days, hours, minutes, seconds };
}

export function openExternalLink(link: string, target = '_blank') {
  open(link, target);
}

export function clearAndDeleteTimeout(timeout: NodeJS.Timeout | null) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  return timeout;
}

/**
 * Check if the attribute is enabled on an element. If we don't specify anything,
 *it should be enabled. That's why '' (empty string) should return true. Ex:
 * <li
 *  lr-magnetic-hover
 * lr-cursor="true"
 * > ...
 * @param element
 * @returns {boolean} value indicating the magnetic hover is enabled or not on this component
 */
export function isAttrActivatedOnElement(element: HTMLElement, attribute: string): boolean {
  const attr = element.getAttribute(attribute);
  return attr === '' || isStringTrue(attr);
}

export function formatTimeHmm(time?: number) {
  if (!time || time <= 0) return '0:00';
  const minutes = Math.floor(time / 1000 / 60);
  const seconds = Math.floor((time / 1000) % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function validateEmail(email: string) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export function localStorageClientSetItem(key: string, value: string) {
  if (import.meta.client) {
    localStorage.setItem(key, value);
  }
}

export function localforageSetItem<T>(...params: Parameters<typeof localforage.setItem<T>>) {
  if (import.meta.client) {
    return localforage.setItem<T>(...params);
  }
  return Promise.resolve(params[1]);
}

export function localforageGetItem<T>(...params: Parameters<typeof localforage.getItem<T>>) {
  if (import.meta.client) {
    return localforage.getItem<T>(...params);
  }
  return Promise.resolve(undefined);
}

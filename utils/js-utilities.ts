export function localeRoute(route: string, locale?: string) {
  return `${route}${locale ? `?locale=${locale}` : ''}`;
}

export function bypass() {}

export function getRandomInt(max: number, startNumber = 0) {
  return Math.floor(Math.random() * max) + startNumber;
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

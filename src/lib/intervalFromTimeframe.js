export function intervalFromTimeframe(timeframe) {
  let interval = Object.values(timeframe)[0];
  let unit = Object.keys(timeframe)[0];

  if (unit === 'seconds') {
    interval += 's';
  } else if (unit === 'minutes') {
    interval += 'm';
  } else if (unit === 'hours') {
    interval += 'h';
  } else if (unit === 'days') {
    interval += 'd';
  } else if (unit === 'weeks') {
    interval += 'w';
  }

  return interval;
}

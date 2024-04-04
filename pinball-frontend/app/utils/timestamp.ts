
const getUtcTimestamp = (date: Date) => {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
}

export const getNowTimestamp = () => {
  const now = new Date();
  return getUtcTimestamp(now);
}

export const getYesterdayTimestamp = () => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  return getUtcTimestamp(yesterday);
}

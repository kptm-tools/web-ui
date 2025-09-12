/**
 * Checks if a given timestamp has expired.
 *
 * @param {number} timeStamp The timestamp in milliseconds to check for expiration.
 * @returns {boolean} Returns `true` if the timestamp has expired (i.e., the current time is after the `timeStamp`), otherwise returns `false`.
 */
export function isTimestampExpired(timeStamp: number): boolean {
  const expirationInstantDate = new Date(timeStamp || 0);
  const now = new Date();
  return now.getTime() > expirationInstantDate.getTime();
}
